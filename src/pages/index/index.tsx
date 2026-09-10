import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { get, post } from '../../utils/request'
import { isDemoMode, getDemoPosts } from '../../utils/demoData'
import FeedCard from '../../components/FeedCard'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import type { Post, FeedTab, User, Topic } from '../../types'
import './index.css'

// 后端响应 → 前端 Post 类型
function transformPost(raw: any): Post {
  return {
    id: raw.id,
    user: {
      id: raw.user_id,
      nickname: raw.user_nickname || '未知用户',
      avatar: raw.user_avatar || '',
      isVip: !!raw.user_is_vip,
      following: 0,
      followers: 0,
      posts: 0,
    },
    content: raw.content || '',
    type: raw.video ? 'video' : raw.images ? 'image' : 'text',
    images: (() => { try { return JSON.parse(raw.images || '[]') } catch { return [] } })(),
    videos: raw.video ? [raw.video] : undefined,
    topics: raw.topic_name ? [{
      id: raw.topic_id,
      name: raw.topic_name,
      icon: raw.topic_icon || '',
    }] : undefined,
    likes: raw.likes_count || 0,
    comments: raw.comments_count || 0,
    shares: raw.shares_count || 0,
    isHot: !!raw.is_hot,
    location: raw.location,
    createdAt: raw.created_at || new Date().toISOString(),
  }
}

const tabs: { key: FeedTab; label: string }[] = [
  { key: 'recommend', label: '推荐' },
  { key: 'follow', label: '关注' },
  { key: 'nearby', label: '附近' },
]

const Index = memo(() => {
  const { currentUser, setPosts, setFeedTab, feedTab, setHasMorePosts, setRefreshing } = useAppStore()

  const [posts, setLocalPosts] = useState<Post[]>([])
  const [hasMore, setLocalHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [refreshing, setLocalRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // 加载帖子列表（演示模式 / 后端不可达时使用示例数据）
  const loadPosts = useCallback(async (pageNum = 1, isRefresh = false) => {
    // 演示模式：直接读取本地示例动态，不请求后端
    if (isDemoMode()) {
      const demo = getDemoPosts(feedTab, pageNum, 10)
      if (isRefresh || pageNum === 1) {
        setLocalPosts(demo.list)
      } else {
        setLocalPosts(prev => [...prev, ...demo.list])
      }
      setLocalHasMore(demo.hasMore && demo.list.length > 0)
      setPage(pageNum)
      return
    }

    try {
      const res = await get<{ list: any[]; total: number; hasMore: boolean }>(
        `/api/posts?tab=${feedTab}&page=${pageNum}&pageSize=10`
      )
      const transformed = (res.data.list || []).map(transformPost)
      if (isRefresh || pageNum === 1) {
        setLocalPosts(transformed)
      } else {
        setLocalPosts(prev => [...prev, ...transformed])
      }
      setLocalHasMore(res.data.hasMore !== false && transformed.length > 0)
      setPage(pageNum)
    } catch (e) {
      console.error('loadPosts error', e)
      // 后端不可达：降级到示例数据，保证页面有内容可看
      const demo = getDemoPosts(feedTab, pageNum, 10)
      if (isRefresh || pageNum === 1) {
        setLocalPosts(demo.list)
      } else {
        setLocalPosts(prev => [...prev, ...demo.list])
      }
      setLocalHasMore(demo.hasMore && demo.list.length > 0)
      setPage(pageNum)
      Taro.showToast({ title: '当前为示例内容', icon: 'none', duration: 1500 })
    }
  }, [feedTab])

  // 首次加载 + Tab 切换时刷新
  useEffect(() => {
    loadPosts(1, true)
  }, [feedTab])

  // 下拉刷新
  const handlePullDownRefresh = useCallback(async () => {
    setLocalRefreshing(true)
    setRefreshing(true)
    await loadPosts(1, true)
    setLocalRefreshing(false)
    setRefreshing(false)
    Taro.stopPullDownRefresh()
  }, [loadPosts])

  // 上拉加载更多
  const handleScrollToLower = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    await loadPosts(page + 1, false)
    setLoadingMore(false)
  }, [loadingMore, hasMore, page, loadPosts])

  // 点赞
  const handleLike = useCallback(async (postId: string) => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.navigateTo({ url: '/pages/login/index' })
      return
    }
    // 演示模式：本地切换点赞状态，不走接口
    if (isDemoMode()) {
      setLocalPosts(prev => prev.map(p => {
        if (p.id !== postId) return p
        const liked = !p.isLiked
        return { ...p, isLiked: liked, likes: Math.max(0, p.likes + (liked ? 1 : -1)) }
      }))
      return
    }
    try {
      const res = await post<{ liked: boolean }>(`/api/posts/${postId}/like`)
      const liked = res.data.liked
      setLocalPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, likes: p.likes + (liked ? 1 : -1) } : p
      ))
      Taro.showToast({ title: liked ? '已点赞' : '取消点赞', icon: 'none', duration: 1000 })
    } catch {
      // 接口失败时本地兜底，保证交互有反馈
      setLocalPosts(prev => prev.map(p => {
        if (p.id !== postId) return p
        const liked = !p.isLiked
        return { ...p, isLiked: liked, likes: Math.max(0, p.likes + (liked ? 1 : -1)) }
      }))
    }
  }, [])

  // 评论跳转
  const handleComment = useCallback((postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` })
  }, [])

  // 分享
  const handleShare = useCallback(() => {
    Taro.showShareMenu({ withShareTicket: true })
  }, [])

  // 用户点击
  const handleUserClick = useCallback((userId: string) => {
    Taro.navigateTo({ url: `/pages/user-detail/index?userId=${userId}` })
  }, [])

  // 话题点击
  const handleTopicClick = useCallback((topicId: string) => {
    Taro.navigateTo({ url: `/pages/topic/index?topicId=${topicId}` })
  }, [])

  // 搜索
  const handleSearch = useCallback((v: string) => {
    if (v.trim()) Taro.navigateTo({ url: `/pages/search/index?keyword=${encodeURIComponent(v)}` })
  }, [])

  // 收藏
  const handleBookmark = useCallback(async (postId: string) => {
    const token = Taro.getStorageSync('token')
    if (!token) { Taro.navigateTo({ url: '/pages/login/index' }); return }
    try {
      const res = await post<{ bookmarked: boolean }>(`/api/posts/${postId}/bookmark`)
      Taro.showToast({ title: res.data.bookmarked ? '已收藏' : '取消收藏', icon: 'none', duration: 1000 })
    } catch {}
  }, [])

  // 未登录引导
  const handlePostClick = useCallback(() => {
    const token = Taro.getStorageSync('token')
    if (!token) Taro.navigateTo({ url: '/pages/login/index' })
  }, [])

  return (
    <View className="index-page">
      <View className="index-page__nav safe-area-top">
        <View className="index-page__nav-content">
          <Text className="index-page__title">社区</Text>
          <View className="index-page__user" onClick={() => currentUser ? Taro.switchTab({ url: '/pages/profile/index' }) : Taro.navigateTo({ url: '/pages/login/index' })}>
            {currentUser
              ? <Text className="index-page__username">{currentUser.nickname}</Text>
              : <Text className="index-page__login-btn">登录</Text>
            }
          </View>
        </View>
      </View>

      <SearchBar placeholder="搜索动态、用户、话题..." onSearch={handleSearch} />

      <View className="index-tabs">
        {tabs.map((t) => (
          <View
            key={t.key}
            className={`index-tabs__item ${feedTab === t.key ? 'index-tabs__item--active' : ''}`}
            onClick={() => setFeedTab(t.key)}
          >
            <Text className="index-tabs__text">{t.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        scrollY
        className="index-page__list"
        lowerThreshold={120}
        onScrollToLower={handleScrollToLower}
        enableBackToTop
        onPullDownRefresh={handlePullDownRefresh}
        refresherEnabled
        refresherTriggered={refreshing}
      >
        {!refreshing && posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onUserClick={handleUserClick}
                onTopicClick={handleTopicClick}
              />
            ))}
            {loadingMore && (
              <View className="index-page__loading">
                <Text className="loading-text">加载中...</Text>
              </View>
            )}
            {!hasMore && (
              <View className="index-page__no-more">
                <Text>— 没有更多了 —</Text>
              </View>
            )}
          </>
        ) : !refreshing ? (
          <EmptyState
            icon="📝"
            title="暂无动态"
            description="快去发布第一条动态吧！"
            actionText="发布动态"
            onAction={() => {
              const token = Taro.getStorageSync('token')
              if (!token) { Taro.navigateTo({ url: '/pages/login/index' }); return }
              Taro.switchTab({ url: '/pages/publish/index' })
            }}
          />
        ) : null}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Index.config = {
  navigationStyle: 'custom',
  enablePullDownRefresh: true,
  backgroundColor: '#F7F7F7',
} as any
Index.displayName = 'Index'
export default Index
