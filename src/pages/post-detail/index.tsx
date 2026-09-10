import { View, Text, Textarea, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import CommentList from '../../components/CommentList'
import EmptyState from '../../components/EmptyState'
import { formatRelativeTime } from '../../utils/formatTime'
import { getDemoComments } from '../../utils/demoData'
import type { Comment, User } from '../../types'
import './index.css'

const PostDetail = memo(() => {
  const router = useRouter()
  const postId = router.params.postId
  const { posts, toggleLike, toggleBookmark } = useAppStore()

  const post = posts.find((p) => p.id === postId) || posts[0]

  // 示例评论：按帖子 id 取演示数据，未命中时给出通用示例
  const [comments, setComments] = useState<Comment[]>(() => getDemoComments(postId || ''))
  const [inputValue, setInputValue] = useState('')

  const handleLike = useCallback(() => { if (post) toggleLike(post.id) }, [post, toggleLike])
  const handleBookmark = useCallback(() => { if (post) toggleBookmark(post.id) }, [post, toggleBookmark])

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) {
      Taro.showToast({ title: '说点什么吧~', icon: 'none' })
      return
    }
    const currentUser: User = useAppStore.getState().currentUser || { id: 'me', nickname: '我', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80', following: 0, followers: 0 }
    const newComment: Comment = {
      id: `c_${Date.now()}`, user: currentUser, content: inputValue.trim(), likes: 0, createdAt: new Date().toISOString(),
    }
    setComments((prev) => [newComment, ...prev])
    setInputValue('')
    Taro.showToast({ title: '评论成功', icon: 'success' })
  }, [inputValue])

  const handleCommentLike = useCallback((commentId: string) => {
    setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.likes + (c.isLiked ? -1 : 1) } : c))
  }, [])

  if (!post) {
    return (
      <View className="detail-page">
        <NavBar title="动态详情" showBack />
        <EmptyState icon="🔍" title="动态不存在" description="该动态可能已被删除" />
      </View>
    )
  }

  return (
    <View className="detail-page">
      <NavBar title="动态详情" showBack rightText="收藏" onRightClick={handleBookmark} />
      <ScrollView scrollY className="detail-page__scroll">
        <FeedCard
          post={post}
          onLike={handleLike}
          onComment={() => {}}
          onShare={() => Taro.showShareMenu({ withShareTicket: true })}
          onUserClick={() => Taro.navigateTo({ url: `/pages/user-detail/index?userId=${post.user.id}` })}
          onTopicClick={(tid) => Taro.navigateTo({ url: `/pages/topic/index?topicId=${tid}` })}
        />

        <View className="detail-comments">
          <Text className="detail-comments__title">全部评论 {comments.length}</Text>
          {comments.length > 0 ? (
            <CommentList
              comments={comments}
              onCommentClick={() => Taro.showToast({ title: '回复功能开发中', icon: 'none' })}
              onUserClick={(uid) => Taro.navigateTo({ url: `/pages/user-detail/index?userId=${uid}` })}
              onLike={handleCommentLike}
            />
          ) : (
            <EmptyState icon="💬" title="暂无评论" description="来抢沙发吧~" />
          )}
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>

      <View className="detail-input">
        <Textarea
          className="detail-input__field"
          placeholder="写下你的评论..."
          value={inputValue}
          onInput={(e: any) => setInputValue(e.detail.value)}
          maxlength={200}
          fixed
        />
        <View className="detail-input__send" onClick={handleSend}>
          <Text className="detail-input__send-text">发送</Text>
        </View>
      </View>
    </View>
  )
})

PostDetail.config = { navigationStyle: 'custom' } as any
PostDetail.displayName = 'PostDetail'
export default PostDetail
