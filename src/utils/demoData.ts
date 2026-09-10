import Taro from '@tarojs/taro'
import type { Post, User, Topic, Comment, FeedTab } from '../types'

/**
 * 演示数据（demo data）
 * ------------------------------------------------------------
 * 用途：在「演示模式」或后端不可达时，为页面提供真实感的示例内容，
 *       避免出现空列表，方便预览 / 演示 / 截图。
 * 说明：本文件只在前端本地生成，不写入后端，不影响线上数据。
 */

export const DEMO_TOKEN = 'demo-token'

/** 是否处于演示模式 */
export const isDemoMode = (): boolean => {
  try {
    return Taro.getStorageSync('token') === DEMO_TOKEN
  } catch {
    return false
  }
}

// ============== 示例用户 ==============
const u = (
  id: string,
  nickname: string,
  avatar: string,
  extra: Partial<User> = {}
): User => ({
  id,
  nickname,
  avatar,
  following: 0,
  followers: 0,
  posts: 0,
  ...extra,
})

export const demoUsers: User[] = [
  u('u_001', '前端开发者', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80', {
    bio: '写代码的人，也写生活', following: 128, followers: 2048, posts: 36, isVip: true, level: 6,
  }),
  u('u_002', '山野小满', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80', {
    bio: '周末爬山 / 植物爱好者', following: 86, followers: 1520, posts: 24, level: 5,
  }),
  u('u_003', '老陈的厨房', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80', {
    bio: '一碗热汤，抵得过所有疲惫', following: 42, followers: 3321, posts: 58, isVip: true, level: 7,
  }),
  u('u_004', '夜跑阿泽', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop&q=80', {
    bio: '每天十公里，风会告诉你答案', following: 210, followers: 890, posts: 19, level: 4,
  }),
  u('u_005', '设计少女阿May', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&q=80', {
    bio: 'UI / 插画 / 收集好看的东西', following: 156, followers: 4310, posts: 47, isVip: true, level: 8,
  }),
  u('u_006', '数码老王', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80', {
    bio: '折腾硬件二十年', following: 73, followers: 1204, posts: 31, level: 5,
  }),
  u('u_007', '小镇书店', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80', {
    bio: '书本很旧，故事很新', following: 301, followers: 2670, posts: 22, level: 6,
  }),
  u('u_008', '旅行者小林', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80', {
    bio: '在路上，也在此刻', following: 189, followers: 5012, posts: 63, isVip: true, level: 9,
  }),
]

const user = (id: string) =>
  demoUsers.find((x) => x.id === id) || demoUsers[0]

// ============== 示例话题 ==============
export const demoTopicList: Topic[] = [
  { id: 't_001', name: '源头生活', icon: '🌿', posts: 1280, description: '记录身边真实的生活片段', category: '生活' },
  { id: 't_002', name: '城市漫步', icon: '🚶', posts: 864, description: '用脚步丈量一座城', category: '生活' },
  { id: 't_003', name: '一人食', icon: '🍜', posts: 2130, description: '好好吃饭，是一个人最大的体面', category: '美食' },
  { id: 't_004', name: '健身打卡', icon: '💪', posts: 1577, description: '自律给我自由', category: '运动' },
  { id: 't_005', name: '好剧推荐', icon: '🎬', posts: 942, description: '那些值得二刷的作品', category: '影视' },
  { id: 't_006', name: '数码好物', icon: '📱', posts: 1188, description: '买之前先看看真实体验', category: '科技' },
]

const topic = (id: string) => demoTopicList.find((t) => t.id === id)

// ============== 示例动态 ==============
const img = (path: string) =>
  `https://images.unsplash.com/photo-${path}?w=800&h=800&fit=crop&q=80`

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600 * 1000).toISOString()

export const demoPosts: Post[] = [
  {
    id: 'p_001',
    user: user('u_001'),
    content:
      '凌晨两点终于把首页的无限滚动调通了。以前总觉得「再加一个需求」是件小事，真到自己写的时候才发现，每个小需求背后都是一堆状态同步。不过看着列表一屏屏刷出来的时候，还是挺有成就感的。',
    type: 'text',
    likes: 328,
    comments: 46,
    shares: 12,
    isHot: true,
    createdAt: hoursAgo(2),
  },
  {
    id: 'p_002',
    user: user('u_002'),
    content:
      '周末爬了趟后山，山顶的风把一整周的疲惫都吹散了。路边的野花开得正好，顺手拍了几张。有些风景不用滤镜，它本来就很好看。',
    type: 'image',
    images: [
      img('1501854140801-50d01698950b'),
      img('1441974231531-c6227db76b6e'),
      img('1470071459604-3b5ec3a7fe05'),
    ],
    topics: [topic('t_001')].filter(Boolean) as Topic[],
    likes: 892,
    comments: 73,
    shares: 31,
    isHot: true,
    location: '城郊 · 后山步道',
    createdAt: hoursAgo(5),
  },
  {
    id: 'p_003',
    user: user('u_003'),
    content:
      '一个人也要好好吃饭。今天做了番茄牛腩，牛腩先焯水再小火炖一个半小时，番茄分两次放——第一次炖化出汤底，第二次临出锅前放，保留一点果肉的口感。配一碗白米饭，完美。',
    type: 'image',
    images: [img('1547592180-85f173990554'), img('1512058564366-18510be2db19')],
    topics: [topic('t_003')].filter(Boolean) as Topic[],
    likes: 1563,
    comments: 128,
    shares: 87,
    isHot: true,
    location: '家里 · 小厨房',
    createdAt: hoursAgo(8),
  },
  {
    id: 'p_004',
    user: user('u_004'),
    content: '第 100 天夜跑打卡。从最初的三公里喘到不行，到现在十公里轻松跑完，身体真的会回应你的坚持。',
    type: 'video',
    videos: ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=800&fit=crop&q=80'],
    images: [img('1552674605-db6ffd4facb5')],
    topics: [topic('t_004')].filter(Boolean) as Topic[],
    likes: 2041,
    comments: 156,
    shares: 209,
    isHot: true,
    location: '滨江跑道',
    createdAt: hoursAgo(11),
  },
  {
    id: 'p_005',
    user: user('u_005'),
    content:
      '重新画了这套图标，从线性改成面性，视觉重量更稳一些。改了七版，最后一版把圆角从 4px 调到 6px，整个气质就对了。设计的细节真的会骗人。',
    type: 'image',
    images: [img('1561070791-2526d30994b5'), img('1558655146-9f40138edfeb'), img('1618005182384-a83a8bd57fbe')],
    topics: [topic('t_006')].filter(Boolean) as Topic[],
    likes: 1167,
    comments: 92,
    shares: 143,
    location: '工作室',
    createdAt: hoursAgo(14),
  },
  {
    id: 'p_006',
    user: user('u_008'),
    content:
      '在海边的小镇住了三天。早上被浪声叫醒，白天什么也不做，就坐在礁石上看云。原来「浪费时间」也可以是一件很正经的事。',
    type: 'image',
    images: [img('1507525428034-b723cf961d3e'), img('1519046904884-53103b34b206')],
    topics: [topic('t_002')].filter(Boolean) as Topic[],
    likes: 2873,
    comments: 214,
    shares: 356,
    isHot: true,
    location: '福建 · 东海岸',
    createdAt: hoursAgo(20),
  },
  {
    id: 'p_007',
    user: user('u_006'),
    content:
      '用了三个月的机械键盘，说点真实感受：手感确实好，但噪音在开放办公室里是个问题。如果你是和同事坐一起，建议选静音轴，别问我怎么知道的。',
    type: 'text',
    topics: [topic('t_006')].filter(Boolean) as Topic[],
    likes: 542,
    comments: 88,
    shares: 19,
    createdAt: hoursAgo(26),
  },
  {
    id: 'p_008',
    user: user('u_007'),
    content:
      '书店第七年。今天有个小朋友拿著攒了一个月的零花钱来买一本诗集，说要送给妈妈。我在柜台后面偷偷红了眼眶。有些生意，赚的不是钱。',
    type: 'image',
    images: [img('1481627834876-b7833e8f5570'), img('1526243741027-444d633d7365')],
    topics: [topic('t_001')].filter(Boolean) as Topic[],
    likes: 3421,
    comments: 267,
    shares: 512,
    isHot: true,
    location: '老城区 · 书店街',
    createdAt: hoursAgo(32),
  },
  {
    id: 'p_009',
    user: user('u_005'),
    content: '昨晚把《漫长的季节》二刷完了，还是觉得那句「往前看，别回头」厉害。有些故事你以为在看别人，其实是在看自己。',
    type: 'text',
    topics: [topic('t_005')].filter(Boolean) as Topic[],
    likes: 976,
    comments: 134,
    shares: 78,
    createdAt: hoursAgo(40),
  },
  {
    id: 'p_010',
    user: user('u_004'),
    content: '今天的拉伸记录。跑完不拉伸，膝盖迟早找你算账——这话是我康复师说的，我原封不动转述给各位。',
    type: 'image',
    images: [img('1571019613454-1cb2f99b2d8b'), img('1518611012118-696072aa579a')],
    topics: [topic('t_004')].filter(Boolean) as Topic[],
    likes: 431,
    comments: 37,
    shares: 22,
    createdAt: hoursAgo(48),
  },
]

/** 首页「关注」页签：只展示已关注用户的内容 */
const followingIds = ['u_001', 'u_003', 'u_005', 'u_008']

/**
 * 按页签 / 分页获取示例动态
 * 结构与后端 /api/posts 返回保持一致（list / total / hasMore）
 */
export const getDemoPosts = (
  tab: FeedTab = 'recommend',
  page = 1,
  pageSize = 10
): { list: Post[]; total: number; hasMore: boolean } => {
  let source = demoPosts
  if (tab === 'follow') {
    source = demoPosts.filter((p) => followingIds.includes(p.user.id))
  } else if (tab === 'nearby') {
    source = demoPosts.filter((p) => !!p.location)
  } else {
    source = [...demoPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0))
  }

  const start = (page - 1) * pageSize
  const list = source.slice(start, start + pageSize)
  return {
    list,
    total: source.length,
    hasMore: start + pageSize < source.length,
  }
}

// ============== 示例评论 ==============
const c = (
  id: string,
  userId: string,
  content: string,
  likes: number,
  hours: number,
  replies?: Comment[]
): Comment => ({
  id,
  user: user(userId),
  content,
  likes,
  createdAt: hoursAgo(hours),
  replies,
})

/** 按帖子 id 获取示例评论 */
export const getDemoComments = (postId: string): Comment[] =>
  ({
    p_001: [
      c('c_101', 'u_006', '状态同步这块我深有同感，最后都是靠一个全局 store 收口的', 24, 1),
      c('c_102', 'u_005', '设计这边也一样，改一个圆角要动三个组件 😂', 18, 1.5),
      c('c_103', 'u_002', '看你写的代码注释比正文还长，是懂维护的', 9, 2),
    ],
    p_002: [
      c('c_201', 'u_008', '这野花是哪种？我也想去找找', 31, 3),
      c('c_202', 'u_007', '第三张的光很舒服，像是快日落的时候拍的', 26, 4, [
        c('c_202_1', 'u_002', '对，五点半左右，太阳刚压到山脊上', 12, 3.5),
      ]),
    ],
    p_003: [
      c('c_301', 'u_002', '番茄分两次放这个技巧学到了，难怪我以前做的总是不够浓', 88, 6),
      c('c_302', 'u_004', '看完饿了一顿夜宵的热量被我吃回来了', 52, 5),
      c('c_303', 'u_005', '求一个具体的火候时间！', 21, 4),
    ],
    p_004: [
      c('c_401', 'u_001', '100 天，太厉害了。我从年初说到现在还没开始', 143, 9),
      c('c_402', 'u_006', '配速多少？我十公里还在 70 分钟徘徊', 47, 8),
    ],
    p_006: [
      c('c_601', 'u_003', '「浪费时间也可以很正经」这句话我记下了', 210, 18),
      c('c_602', 'u_005', '请问是哪个小镇？想加入行程', 96, 16),
    ],
    p_008: [
      c('c_801', 'u_002', '看哭了。这样的书店是这个城市的福气', 386, 30),
      c('c_802', 'u_008', '下次去一定光顾，地址方便发一下吗', 74, 28),
    ],
  }[postId] || [
    c(`c_${postId}_1`, 'u_001', '写得真好，收藏起来慢慢看', 15, 3),
    c(`c_${postId}_2`, 'u_002', '有同感，感谢分享～', 8, 2),
  ])

/** 示例通知（消息页） */
export const getDemoNotifications = () => [
  {
    id: 'n_001',
    type: 'like' as const,
    user: user('u_005'),
    content: '赞了你的动态',
    isRead: false,
    createdAt: hoursAgo(1),
  },
  {
    id: 'n_002',
    type: 'comment' as const,
    user: user('u_006'),
    content: '评论：状态同步这块我深有同感…',
    isRead: false,
    createdAt: hoursAgo(3),
  },
  {
    id: 'n_003',
    type: 'follow' as const,
    user: user('u_008'),
    content: '关注了你',
    isRead: false,
    createdAt: hoursAgo(7),
  },
  {
    id: 'n_004',
    type: 'mention' as const,
    user: user('u_003'),
    content: '在动态中提到了你',
    isRead: true,
    createdAt: hoursAgo(26),
  },
  {
    id: 'n_005',
    type: 'system' as const,
    content: '欢迎加入源头社区，完成新手任务可获得 100 积分',
    isRead: true,
    createdAt: hoursAgo(50),
  },
]
