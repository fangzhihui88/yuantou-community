import { create } from 'zustand'
import type {
  User, Post, Notification, Conversation, Topic, Comment,
  FeedTab, ThemeMode, SearchType,
  Activity, RankingItem, WalletTx, Coupon, MallProduct, ExchangeRecord,
  Badge, LevelInfo, CheckinInfo, LotteryPrize, Draft, Visitor,
  NotificationPrefs, UserSettings, FAQItem,
} from '../types'
import { demoPosts, demoTopicList } from '../utils/demoData'

// ============== Mock 数据 ==============
const mockCurrentUser: User = {
  id: 'user_001',
  nickname: '前端开发者',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
  bio: '热爱前端技术，追求卓越用户体验',
  gender: 'male',
  location: '深圳',
  following: 128,
  followers: 1024,
  posts: 56,
  isVip: true,
  level: 8,
}

const mkUser = (id: string, nickname: string, seed: number, extra: Partial<User> = {}): User => ({
  id, nickname, avatar: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&q=80`, following: 0, followers: 100 + seed * 37,
  posts: 1, ...extra,
})

const mkPost = (
  id: string, user: Partial<User> & { id: string; nickname: string; avatar: string },
  content: string, opts: Partial<Post> = {},
): Post => ({
  id, user: { ...mockCurrentUser, ...user } as User, content,
  type: 'text', likes: 0, comments: 0, shares: 0, createdAt: new Date().toISOString(),
  ...opts,
})

const mockPosts: Post[] = [
  mkPost('post_001',
    { id: 'user_002', nickname: '产品经理小王', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80', followers: 5200, isVip: true },
    '今天分享一个 React 性能优化的技巧 —— 使用 useMemo 和 useCallback 来避免不必要的重新渲染。#前端 #React',
    { images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&q=80'], topics: [{ id: 'topic_001', name: '前端', posts: 10000 }], likes: 328, comments: 45, shares: 12, isHot: true }),
  mkPost('post_002',
    { id: 'user_003', nickname: '设计师阿美', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80', followers: 8900 },
    '分享一组极简风格的 UI 设计稿，大家觉得怎么样？',
    { images: ['https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop&q=80', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop&q=80', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop&q=80'], topics: [{ id: 'topic_002', name: 'UI设计', posts: 8500 }], likes: 567, comments: 89, shares: 34, location: '深圳·南山', isHot: true }),
  mkPost('post_003',
    { id: 'user_004', nickname: '全栈工程师', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80', followers: 3200, isVip: true },
    'TypeScript 4.9 发布！这些新特性你一定要知道...',
    { images: ['https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop&q=80'], topics: [{ id: 'topic_003', name: 'TypeScript', posts: 5200 }], likes: 234, comments: 67, shares: 45 }),
  mkPost('post_004',
    { id: 'user_005', nickname: '技术大V', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80', followers: 50000, isVip: true },
    '一分钟看懂前端工程化演进 🚀',
    { videos: ['https://fangzhihui88.github.io/yuantou-community/videos/barista.mp4'], type: 'video', topics: [{ id: 'topic_004', name: '工程化', posts: 3100 }], likes: 1203, comments: 156, shares: 89, isHot: true }),
  mkPost('post_005',
    { id: 'user_006', nickname: '咖啡爱好者', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80', followers: 860 },
    '周末手冲咖啡日记 ☕ 今天的豆子是埃塞俄比亚耶加雪菲，花果香很足！',
    { images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&q=80'], topics: [{ id: 'topic_009', name: '生活方式', posts: 2600 }], likes: 89, comments: 12, shares: 3, location: '深圳·福田' }),
  mkPost('post_006',
    { id: 'user_007', nickname: '摄影达人', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&q=80', followers: 15600, isVip: true },
    '黄昏时分的深圳湾，绝美！📷',
    { images: ['https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop&q=80', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=80'], topics: [{ id: 'topic_010', name: '摄影', posts: 4100 }], likes: 890, comments: 45, shares: 23, location: '深圳·南山' }),
  // 生活化示例动态（与演示数据同源，供未接后端的页面展示）
  ...demoPosts,
]

const mockTopics: Topic[] = [
  { id: 'topic_001', name: '前端', posts: 10000, description: '前端开发技术交流', isFollowed: true, category: '技术' },
  { id: 'topic_002', name: 'UI设计', posts: 8500, description: 'UI/UX 设计分享', category: '设计' },
  { id: 'topic_003', name: 'React', posts: 7200, description: 'React 生态交流', category: '技术' },
  { id: 'topic_004', name: 'TypeScript', posts: 6500, description: 'TS 类型体操', category: '技术' },
  { id: 'topic_005', name: 'Vue', posts: 5800, category: '技术' },
  { id: 'topic_006', name: '小程序', posts: 5200, category: '技术' },
  { id: 'topic_007', name: 'Node.js', posts: 4800, category: '技术' },
  { id: 'topic_008', name: '产品经理', posts: 4200, category: '职场' },
  { id: 'topic_009', name: '生活方式', posts: 2600, category: '生活' },
  { id: 'topic_010', name: '摄影', posts: 4100, category: '生活' },
  // 生活化示例话题（与演示数据同源）
  ...demoTopicList,
]

const mockNotifications: Notification[] = [
  { id: 'notif_001', type: 'like', user: mkUser('user_002', '产品经理小王', 1), content: '赞了你的动态', post: mockPosts[0], isRead: false, createdAt: '2026-08-21T12:00:00Z' },
  { id: 'notif_002', type: 'comment', user: mkUser('user_003', '设计师阿美', 2), content: '评论了你的动态：「写得很好！」', post: mockPosts[0], isRead: false, createdAt: '2026-08-21T11:30:00Z' },
  { id: 'notif_003', type: 'follow', user: mkUser('user_004', '全栈工程师', 3), content: '关注了你', isRead: true, createdAt: '2026-08-21T10:00:00Z' },
  { id: 'notif_004', type: 'system', content: '欢迎加入社区！记得完善个人资料哦~', isRead: false, createdAt: '2026-08-20T09:00:00Z' },
  { id: 'notif_005', type: 'mention', user: mkUser('user_006', '咖啡爱好者', 5), content: '在评论中提到了你', post: mockPosts[4], isRead: false, createdAt: '2026-08-21T09:00:00Z' },
]

const mockConversations: Conversation[] = [
  { id: 'conv_001', user: mkUser('user_002', '产品经理小王', 1), lastMessage: '那个需求文档你看了吗？', lastTime: '2026-08-21T18:00:00Z', unread: 2, messages: [
    { id: 'm1', conversationId: 'conv_001', senderId: 'user_002', content: '在吗？', createdAt: '2026-08-21T17:50:00Z' },
    { id: 'm2', conversationId: 'conv_001', senderId: 'user_002', content: '那个需求文档你看了吗？', createdAt: '2026-08-21T18:00:00Z' },
  ] },
  { id: 'conv_002', user: mkUser('user_003', '设计师阿美', 2), lastMessage: '[图片]', lastTime: '2026-08-20T20:30:00Z', unread: 0, messages: [] },
]

// ============== 新功能域 Mock ==============
const mockActivities: Activity[] = [
  { id: 'act_001', title: '深圳前端技术 Meetup 2026', cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&h=600&fit=crop&q=80', location: '深圳·南山区科兴科学园', startTime: '2026-09-05T14:00:00Z', participants: 86, maxParticipants: 120, joined: false, host: mkUser('user_005', '技术大V', 4), desc: '前端新技术趋势分享，现场交流，免费参加' },
  { id: 'act_002', title: 'UI 设计工作坊：从 0 到 1', cover: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&h=600&fit=crop&q=80', location: '深圳·福田区设计产业园', startTime: '2026-09-12T09:30:00Z', participants: 32, maxParticipants: 40, joined: true, host: mkUser('user_003', '设计师阿美', 2), desc: '手把手带你完成一个完整的设计项目' },
  { id: 'act_003', title: '周末摄影外拍活动', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=600&fit=crop&q=80', location: '深圳·深圳湾公园', startTime: '2026-08-30T16:00:00Z', participants: 18, maxParticipants: 30, joined: false, host: mkUser('user_007', '摄影达人', 6), desc: '一起拍日落，交流摄影技巧' },
]

const mockRankings: RankingItem[] = [
  { id: 'rk_001', rank: 1, user: mkUser('user_005', '技术大V', 4), score: 99999, title: '本周互动王', trend: 'up' },
  { id: 'rk_002', rank: 2, user: mkUser('user_003', '设计师阿美', 2), score: 85600, title: '本周互动王', trend: 'up' },
  { id: 'rk_003', rank: 3, user: mkUser('user_007', '摄影达人', 6), score: 72300, title: '本周互动王', trend: 'same' },
  { id: 'rk_004', rank: 4, user: mkUser('user_002', '产品经理小王', 1), score: 65400, title: '本周互动王', trend: 'down' },
  { id: 'rk_005', rank: 5, user: mockCurrentUser, score: 43200, title: '本周互动王', trend: 'up' },
]

const mockWalletTxs: WalletTx[] = [
  { id: 'tx_001', type: 'income', amount: 500, title: '每日签到奖励', createdAt: '2026-08-21T09:00:00Z' },
  { id: 'tx_002', type: 'expense', amount: 200, title: '积分商城兑换', createdAt: '2026-08-20T15:00:00Z' },
  { id: 'tx_003', type: 'income', amount: 1200, title: '发布优质内容奖励', createdAt: '2026-08-19T10:00:00Z' },
]

const mockCoupons: Coupon[] = [
  { id: 'cp_001', name: '商城满减券', value: 20, threshold: 100, expiredAt: '2026-09-30T00:00:00Z', used: false },
  { id: 'cp_002', name: 'VIP 体验券', value: 30, threshold: 0, expiredAt: '2026-08-31T00:00:00Z', used: true },
]

const mockMallProducts: MallProduct[] = [
  { id: 'mp_001', name: '社区定制帆布袋', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80', points: 1500, stock: 20 },
  { id: 'mp_002', name: '限量版社区徽章', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop&q=80', points: 800, stock: 50 },
  { id: 'mp_003', name: '咖啡兑换券', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop&q=80', points: 3000, stock: 10 },
  { id: 'mp_004', name: '社区会员月卡', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80', points: 5000, stock: 5 },
]

const mockExchangeRecords: ExchangeRecord[] = [
  { id: 'ex_001', productName: '社区定制帆布袋', points: 1500, createdAt: '2026-08-20T15:00:00Z', status: 'done' },
  { id: 'ex_002', productName: '限量版社区徽章', points: 800, createdAt: '2026-08-15T10:00:00Z', status: 'done' },
]

const mockBadges: Badge[] = [
  { id: 'bd_001', name: '新手上路', icon: '🌱', desc: '完成注册', unlocked: true },
  { id: 'bd_002', name: '社交达人', icon: '🤝', desc: '关注 10 位用户', unlocked: true },
  { id: 'bd_003', name: '内容创作者', icon: '✍️', desc: '发布 5 条动态', unlocked: true },
  { id: 'bd_004', name: '话题之王', icon: '👑', desc: '话题互动破百', unlocked: true },
  { id: 'bd_005', name: '连续签到王', icon: '🔥', desc: '连续签到 7 天', unlocked: false },
  { id: 'bd_006', name: '活动先锋', icon: '🎉', desc: '参加 3 场活动', unlocked: false },
  { id: 'bd_007', name: '收藏家', icon: '💎', desc: '收藏 10 条动态', unlocked: false },
  { id: 'bd_008', name: '社区之光', icon: '🌟', desc: '获得 1000 赞', unlocked: false },
]

const mockCheckin: CheckinInfo = {
  streak: 5,
  todayChecked: true,
  totalDays: 28,
  rewards: [
    { day: 1, points: 10 }, { day: 2, points: 10 }, { day: 3, points: 15 },
    { day: 4, points: 15 }, { day: 5, points: 20 }, { day: 6, points: 20 }, { day: 7, points: 50 },
  ],
}

const mockLotteryPrizes: LotteryPrize[] = [
  { id: 'lp_001', name: '1000 积分', icon: '💰', rate: 5 },
  { id: 'lp_002', name: '500 积分', icon: '🎁', rate: 15 },
  { id: 'lp_003', name: '100 积分', icon: '🎀', rate: 30 },
  { id: 'lp_004', name: '谢谢参与', icon: '🍀', rate: 50 },
]

const mockDrafts: Draft[] = [
  { id: 'dr_001', content: '今天要发一篇关于 Taro 跨端开发的文章...', images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80/200'], updatedAt: '2026-08-21T22:00:00Z' },
  { id: 'dr_002', content: '周末爬山的照片，晚点配文', images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80/201'], updatedAt: '2026-08-20T18:30:00Z' },
]

const mockVisitors: Visitor[] = [
  { id: 'vs_001', user: mkUser('user_002', '产品经理小王', 1), visitedAt: '2026-08-21T20:00:00Z' },
  { id: 'vs_002', user: mkUser('user_006', '咖啡爱好者', 5), visitedAt: '2026-08-21T19:30:00Z' },
  { id: 'vs_003', user: mkUser('user_007', '摄影达人', 6), visitedAt: '2026-08-20T22:00:00Z' },
]

const mockPrefs: NotificationPrefs = { like: true, comment: true, follow: true, system: true, chat: true }

const mockSettings: UserSettings = {
  fontSize: 'medium', saveDataMode: false, soundOn: true, vibrateOn: true, language: 'zh-CN', hideOnline: false,
}

const mockFAQs: FAQItem[] = [
  { q: '如何修改头像和昵称？', a: '进入「我的」→「编辑个人资料」，即可修改头像、昵称、性别和简介。' },
  { q: '积分如何获得？', a: '每日签到、发布优质内容、参与活动、获得点赞等都可以获得积分。' },
  { q: '如何参加同城活动？', a: '进入「发现」→「同城活动」，选择感兴趣的活动点击报名即可。' },
  { q: '私信功能如何使用？', a: '在他人主页点击「私信」按钮，或通过「消息」页的私信 Tab 进入聊天。' },
]

// ============== 好友系统 Mock 用户 ==============
const mockUsers: User[] = [
  { ...mockCurrentUser },
  mkUser('user_002', '产品经理小王', 1, { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80', isVip: true }),
  mkUser('user_003', '设计师阿美', 2, { avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80' }),
  mkUser('user_004', '全栈工程师', 3, { avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80', isVip: true }),
  mkUser('user_005', '技术大V', 4, { avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80', isVip: true }),
  mkUser('user_006', '咖啡爱好者', 5, { avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80' }),
]

// ============== Store ==============
interface AppState {
  currentUser: User | null
  isLoggedIn: boolean
  themeMode: ThemeMode

  posts: Post[]
  feedTab: FeedTab
  hasMorePosts: boolean
  postsPage: number
  searchType: SearchType

  bookmarks: Post[]
  likedPosts: string[]
  myPosts: Post[]

  topics: Topic[]
  notifications: Notification[]
  unreadCount: number
  conversations: Conversation[]

  followingList: User[]
  followersList: User[]
  visitors: Visitor[]

  activities: Activity[]
  rankings: RankingItem[]
  rankingType: 'hot' | 'new' | 'vip'

  walletBalance: number
  walletTxs: WalletTx[]
  coupons: Coupon[]
  pointsBalance: number

  mallProducts: MallProduct[]
  exchangeRecords: ExchangeRecord[]

  badges: Badge[]
  checkin: CheckinInfo
  lotteryPrizes: LotteryPrize[]
  draftPosts: Draft[]

  prefs: NotificationPrefs
  settings: UserSettings
  faqs: FAQItem[]

  isLoading: boolean
  isRefreshing: boolean
  // 扫码支付
  payOrders: Array<{id:string;amount:number;merchantName:string;merchantAvatar:string;status:'pending'|'paid'|'failed'|'refunded';createdAt:string;desc?:string}>
  paymentCodes: Array<{id:string;amount?:number;note?:string;createdAt:string;expiredAt:string}>
  // 好友系统
  friendRequests: Array<{id:string;fromUser:User;toUserId:string;status:'pending'|'accepted'|'rejected';message?:string;createdAt:string;updatedAt:string}>
  friends: Array<User & {remark?:string;tag?:string;isTop?:boolean;lastChatTime?:string;isOnline?:boolean;source:string}>
  unreadFriendReqCount: number

  // actions
  setCurrentUser: (u: User | null) => void
  setLoginStatus: (s: boolean) => void
  logout: () => void
  toggleTheme: () => void
  setTheme: (m: ThemeMode) => void

  setFeedTab: (t: FeedTab) => void
  setSearchType: (t: SearchType) => void
  addPost: (p: Post) => void
  updatePost: (id: string, u: Partial<Post>) => void
  removePost: (id: string) => void
  setPosts: (p: Post[]) => void
  appendPosts: (p: Post[]) => void
  setHasMorePosts: (b: boolean) => void
  setPostsPage: (n: number) => void

  toggleLike: (postId: string) => void
  toggleBookmark: (postId: string) => void

  setTopics: (t: Topic[]) => void
  followTopic: (id: string) => void

  addNotification: (n: Notification) => void
  setNotifications: (n: Notification[]) => void
  markAsRead: (id: string) => void
  markAllRead: () => void
  setUnreadCount: (n: number) => void

  addConversation: (c: Conversation) => void
  sendMessage: (convId: string, content: string) => void
  markConversationRead: (convId: string) => void

  setFollowingList: (u: User[]) => void
  setFollowersList: (u: User[]) => void
  toggleFollowUser: (userId: string) => void

  joinActivity: (id: string) => void
  setRankingType: (t: 'hot' | 'new' | 'vip') => void

  spendPoints: (n: number) => void
  earnPoints: (n: number) => void
  recharge: (amount: number) => void
  withdraw: (amount: number) => void
  exchangeProduct: (id: string) => void
  checkinToday: () => void
  drawLottery: () => number
  useCoupon: (id: string) => void

  addDraft: (d: Draft) => void
  removeDraft: (id: string) => void

  setPrefs: (p: Partial<NotificationPrefs>) => void
  setSettings: (s: Partial<UserSettings>) => void

  setLoading: (b: boolean) => void
  setRefreshing: (b: boolean) => void

  // 扫码支付
  addPayOrder: (order: {
    id: string
    amount: number
    merchantName: string
    merchantAvatar: string
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    createdAt: string
    desc?: string
  }) => void
  updatePayOrderStatus: (id: string, status: 'pending' | 'paid' | 'failed' | 'refunded') => void

  // 好友系统 actions
  sendFriendRequest: (toUserId: string, message?: string) => void
  acceptFriendRequest: (id: string) => void
  rejectFriendRequest: (id: string) => void
  updateFriendRemark: (userId: string, remark: string) => void
  toggleFriendTop: (userId: string) => void
  removeFriend: (userId: string) => void
}

const findPost = (posts: Post[], id: string) => posts.find((p) => p.id === id)

export const useAppStore = create<AppState>((set, get) => ({
  // 启动时从 Storage 恢复登录态（由登录页写入）
  currentUser: (() => {
    try {
      const saved = Taro.getStorageSync('currentUser')
      return saved || null
    } catch { return null }
  })(),
  isLoggedIn: !!(() => { try { return !!Taro.getStorageSync('token') } catch { return false } })(),
  themeMode: 'light',

  posts: mockPosts,
  feedTab: 'recommend',
  hasMorePosts: true,
  postsPage: 1,
  searchType: 'all',

  bookmarks: [],
  likedPosts: [],
  myPosts: [mockPosts[0]],

  topics: mockTopics,
  notifications: mockNotifications,
  unreadCount: 4,
  conversations: mockConversations,

  followingList: [mockCurrentUser, mkUser('user_002', '产品经理小王', 1), mkUser('user_003', '设计师阿美', 2)],
  followersList: [mkUser('user_004', '全栈工程师', 3), mkUser('user_005', '技术大V', 4, { isVip: true }), mkUser('user_007', '摄影达人', 6)],
  visitors: mockVisitors,

  activities: mockActivities,
  rankings: mockRankings,
  rankingType: 'hot',

  walletBalance: 680,
  walletTxs: mockWalletTxs,
  coupons: mockCoupons,
  pointsBalance: 3600,

  mallProducts: mockMallProducts,
  exchangeRecords: mockExchangeRecords,

  badges: mockBadges,
  checkin: mockCheckin,
  lotteryPrizes: mockLotteryPrizes,
  draftPosts: mockDrafts,

  prefs: mockPrefs,
  settings: mockSettings,
  faqs: mockFAQs,

  isLoading: false,
  isRefreshing: false,
  // 扫码支付 mock
  payOrders: [
    { id: 'po_001', amount: 0.01, merchantName: '源头社区商户', merchantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', status: 'paid', createdAt: '2026-08-20T14:30:00Z', desc: '会员充值' },
    { id: 'po_002', amount: 12.50, merchantName: '社区便利店', merchantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', status: 'paid', createdAt: '2026-08-19T18:00:00Z', desc: '商品购买' },
    { id: 'po_003', amount: 88.00, merchantName: '源头咖啡馆', merchantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', status: 'paid', createdAt: '2026-08-18T12:00:00Z' },
    { id: 'po_004', amount: 5.00, merchantName: '打印服务', merchantAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop', status: 'pending', createdAt: '2026-08-22T10:00:00Z', desc: '待支付' },
    { id: 'po_005', amount: 200.00, merchantName: '社区物业', merchantAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop', status: 'failed', createdAt: '2026-08-17T09:00:00Z', desc: '物业费' },
  ],
  paymentCodes: [
    { id: 'pc_001', amount: undefined, note: '任意金额收款码', createdAt: '2026-08-15T00:00:00Z', expiredAt: '2027-08-15T00:00:00Z' },
    { id: 'pc_002', amount: 66.66, note: '六六大顺', createdAt: '2026-08-18T00:00:00Z', expiredAt: '2026-09-18T00:00:00Z' },
  ],
  // 好友系统 mock
  friendRequests: [
    { id: 'fr_001', fromUser: mockUsers[2], toUserId: 'user_001', status: 'pending', message: '你好，我是前端开发者，想和你交流技术', createdAt: '2026-08-21T10:00:00Z', updatedAt: '2026-08-21T10:00:00Z' },
    { id: 'fr_002', fromUser: mockUsers[3], toUserId: 'user_001', status: 'pending', message: '看到你的作品很棒，申请加个好友', createdAt: '2026-08-22T08:00:00Z', updatedAt: '2026-08-22T08:00:00Z' },
    { id: 'fr_003', fromUser: mockUsers[4], toUserId: 'user_001', status: 'accepted', message: '', createdAt: '2026-08-18T09:00:00Z', updatedAt: '2026-08-18T10:00:00Z' },
  ],
  friends: [
    { ...mockUsers[1], remark: '老王', tag: '同事', isTop: true, lastChatTime: '2026-08-21T18:00:00Z', isOnline: true, source: 'search' },
    { ...mockUsers[2], tag: '技术', isOnline: false, lastChatTime: '2026-08-20T20:30:00Z', source: 'recommend' },
    { ...mockUsers[4], remark: '大V', tag: '行业', isTop: false, isOnline: true, source: 'qr' },
    { ...mockUsers[5], tag: '生活', isOnline: false, source: 'nearby' },
  ],
  unreadFriendReqCount: 2,

  setCurrentUser: (u) => set({ currentUser: u, isLoggedIn: !!u }),
  setLoginStatus: (s) => set({ isLoggedIn: s }),
  logout: () => {
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('currentUser')
    set({ currentUser: null, isLoggedIn: false })
  },
  toggleTheme: () => set((s) => ({ themeMode: s.themeMode === 'light' ? 'dark' : 'light' })),
  setTheme: (m) => set({ themeMode: m }),

  setFeedTab: (t) => set({ feedTab: t }),
  setSearchType: (t) => set({ searchType: t }),
  addPost: (p) => set((s) => ({ posts: [p, ...s.posts], myPosts: [p, ...s.myPosts] })),
  updatePost: (id, u) => set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, ...u } : p)) })),
  removePost: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id), myPosts: s.myPosts.filter((p) => p.id !== id) })),
  setPosts: (p) => set({ posts: p }),
  appendPosts: (p) => set((s) => ({ posts: [...s.posts, ...p] })),
  setHasMorePosts: (b) => set({ hasMorePosts: b }),
  setPostsPage: (n) => set({ postsPage: n }),

  toggleLike: (postId) => set((s) => {
    const posts = s.posts.map((p) => {
      if (p.id !== postId) return p
      const isLiked = !p.isLiked
      return { ...p, isLiked, likes: p.likes + (isLiked ? 1 : -1) }
    })
    const likedPosts = findPost(posts, postId)?.isLiked ? [...s.likedPosts, postId] : s.likedPosts.filter((x) => x !== postId)
    return { posts, likedPosts }
  }),
  toggleBookmark: (postId) => set((s) => {
    const posts = s.posts.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    const target = findPost(posts, postId)
    const bookmarks = target?.isBookmarked
      ? [target, ...s.bookmarks]
      : s.bookmarks.filter((b) => b.id !== postId)
    return { posts, bookmarks }
  }),

  setTopics: (t) => set({ topics: t }),
  followTopic: (id) => set((s) => ({ topics: s.topics.map((t) => (t.id === id ? { ...t, isFollowed: !t.isFollowed } : t)) })),

  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications], unreadCount: s.unreadCount + 1 })),
  setNotifications: (n) => set({ notifications: n }),
  markAsRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)), unreadCount: Math.max(0, s.unreadCount - 1) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })), unreadCount: 0 })),
  setUnreadCount: (n) => set({ unreadCount: n }),

  addConversation: (c) => set((s) => ({ conversations: [c, ...s.conversations] })),
  sendMessage: (convId, content) => set((s) => {
    const newMsg = { id: `m_${Date.now()}`, conversationId: convId, senderId: s.currentUser!.id, content, type: 'text' as const, createdAt: new Date().toISOString() }
    const exists = s.conversations.some((c) => c.id === convId)
    if (exists) {
      return {
        conversations: s.conversations.map((c) => c.id === convId
          ? { ...c, lastMessage: content, lastTime: new Date().toISOString(), messages: [...c.messages, newMsg] }
          : c),
      }
    }
    // 会话不存在时自动创建（从 user-detail 等页面发起私信）
    const userId = convId.startsWith('conv_')
      ? convId.slice(5)
      : convId
    const knownUser = s.followingList.find((u) => u.id === userId)
    const newConv: Conversation = {
      id: convId,
      user: knownUser ?? { id: userId, nickname: '用户' + userId.slice(-3), avatar: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&q=80`, following: 0, followers: 0, posts: 0 },
      lastMessage: content,
      lastTime: new Date().toISOString(),
      unread: 0,
      messages: [newMsg],
    }
    return { conversations: [newConv, ...s.conversations] }
  }),
  markConversationRead: (convId) => set((s) => ({
    conversations: s.conversations.map((c) => (c.id === convId ? { ...c, unread: 0 } : c)),
  })),

  setFollowingList: (u) => set({ followingList: u }),
  setFollowersList: (u) => set({ followersList: u }),
  toggleFollowUser: (userId) => set((s) => {
    const exists = s.followingList.find((u) => u.id === userId)
    const followingList = exists
      ? s.followingList.filter((u) => u.id !== userId)
      : [...s.followingList, mkUser(userId, '用户' + userId.slice(-3), 50 + (userId.charCodeAt(userId.length - 1) % 40))]
    return { followingList }
  }),

  joinActivity: (id) => set((s) => ({
    activities: s.activities.map((a) => a.id === id
      ? { ...a, joined: !a.joined, participants: a.participants + (a.joined ? -1 : 1) }
      : a),
  })),
  setRankingType: (t) => set({ rankingType: t }),

  spendPoints: (n) => set((s) => ({ pointsBalance: Math.max(0, s.pointsBalance - n) })),
  earnPoints: (n) => set((s) => ({ pointsBalance: s.pointsBalance + n })),
  exchangeProduct: (id) => set((s) => {
    const product = s.mallProducts.find((p) => p.id === id)
    if (!product || product.exchanged) return {}
    return {
      mallProducts: s.mallProducts.map((p) => (p.id === id ? { ...p, exchanged: true, stock: p.stock - 1 } : p)),
      pointsBalance: Math.max(0, s.pointsBalance - product.points),
      exchangeRecords: [{ id: `ex_${Date.now()}`, productName: product.name, points: product.points, createdAt: new Date().toISOString(), status: 'pending' as const }, ...s.exchangeRecords],
    }
  }),
  checkinToday: () => set((s) => ({
    checkin: { ...s.checkin, todayChecked: true, streak: s.checkin.streak + 1, totalDays: s.checkin.totalDays + 1 },
    pointsBalance: s.pointsBalance + 10,
  })),
  drawLottery: () => {
    const prizes = get().lotteryPrizes
    let rand = Math.random() * 100
    let acc = 0
    let idx = prizes.length - 1
    for (let i = 0; i < prizes.length; i++) {
      acc += prizes[i].rate
      if (rand < acc) { idx = i; break }
    }
    const prize = prizes[idx]
    const points = prize.id === 'lp_001' ? 1000 : prize.id === 'lp_002' ? 500 : prize.id === 'lp_003' ? 100 : 0
    if (points > 0) {
      set((s) => ({ pointsBalance: s.pointsBalance + points, walletTxs: [{ id: `tx_${Date.now()}`, type: 'income', amount: points, title: `抽奖获得 ${prize.name}`, createdAt: new Date().toISOString() }, ...s.walletTxs] }))
    }
    return idx
  },
  useCoupon: (id) => set((s) => ({ coupons: s.coupons.map((c) => (c.id === id ? { ...c, used: true } : c)) })),
  recharge: (amount) => set((s) => ({ walletBalance: s.walletBalance + amount, walletTxs: [{ id: `tx_${Date.now()}`, type: 'income', amount, title: '账户充值', createdAt: new Date().toISOString() }, ...s.walletTxs] })),
  withdraw: (amount) => set((s) => ({ walletBalance: s.walletBalance - amount, walletTxs: [{ id: `tx_${Date.now()}`, type: 'expense', amount, title: '余额提现', createdAt: new Date().toISOString() }, ...s.walletTxs] })),

  addDraft: (d) => set((s) => ({ draftPosts: [d, ...s.draftPosts] })),
  removeDraft: (id) => set((s) => ({ draftPosts: s.draftPosts.filter((d) => d.id !== id) })),

  setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),
  setSettings: (s2) => set((s) => ({ settings: { ...s.settings, ...s2 } })),

  setLoading: (b) => set({ isLoading: b }),
  setRefreshing: (b) => set({ isRefreshing: b }),

  // 扫码支付 actions
  addPayOrder: (order) => set((s) => ({
    payOrders: [{ ...order, id: `po_${Date.now()}` }, ...s.payOrders],
    walletBalance: order.status === 'paid' ? s.walletBalance - order.amount : s.walletBalance,
  })),
  updatePayOrderStatus: (id, status) => set((s) => ({
    payOrders: s.payOrders.map((o) => o.id === id ? { ...o, status } : o),
    walletBalance: status === 'paid' ? s.walletBalance - (s.payOrders.find(o=>o.id===id)?.amount||0) : s.walletBalance,
  })),
  addPaymentCode: (code) => set((s) => ({
    paymentCodes: [{ ...code, id: `pc_${Date.now()}` }, ...s.paymentCodes],
  })),
  removePaymentCode: (id) => set((s) => ({
    paymentCodes: s.paymentCodes.filter((c) => c.id !== id),
  })),

  // 好友系统 actions
  sendFriendRequest: (toUserId, message) => set((s) => ({
    friendRequests: [{
      id: `fr_${Date.now()}`,
      fromUser: s.currentUser as User,
      toUserId,
      status: 'pending',
      message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...s.friendRequests],
  })),
  acceptFriendRequest: (id) => set((s) => {
    const req = s.friendRequests.find(r => r.id === id)
    if (!req) return s
    const newFriend = { ...req.fromUser, source: 'recommend' as const }
    return {
      friendRequests: s.friendRequests.map(r => r.id === id ? { ...r, status: 'accepted', updatedAt: new Date().toISOString() } : r),
      friends: [newFriend, ...s.friends],
      unreadFriendReqCount: Math.max(0, s.unreadFriendReqCount - 1),
    }
  }),
  rejectFriendRequest: (id) => set((s) => ({
    friendRequests: s.friendRequests.map(r => r.id === id ? { ...r, status: 'rejected', updatedAt: new Date().toISOString() } : r),
    unreadFriendReqCount: Math.max(0, s.unreadFriendReqCount - 1),
  })),
  updateFriendRemark: (userId, remark) => set((s) => ({
    friends: s.friends.map(f => f.id === userId ? { ...f, remark } : f),
  })),
  toggleFriendTop: (userId) => set((s) => ({
    friends: s.friends.map(f => f.id === userId ? { ...f, isTop: !f.isTop } : f),
  })),
  removeFriend: (userId) => set((s) => ({
    friends: s.friends.filter(f => f.id !== userId),
  })),
}))
