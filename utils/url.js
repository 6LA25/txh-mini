// let domain = 'https://1002.app.anxuanhouse.com'
let domain = 'http://47.103.39.72:8888'
export default {
  test: 'http://58.214.13.42:8859/zuul/login/login',
  tim: 'http://47.103.39.72:8888/api/im/genUserSig',
  login: `${domain}/api/app/auth/wechat`,
  banner: `${domain}/api/app/query/banner/items`,
  notice: `${domain}/api/app/query/notice/items`,
  hotHouses: `${domain}/api/app/query/house/items`,
  followHouses: `${domain}/api/app/protected/follow/items`,
  addShareCount: `${domain}/api/app/house/addShareCount`,
  searchHouse: `${domain}/api/app/query/house/items`,
  areas: `${domain}/api/app/common/area/children`,
  houseDetail: `${domain}/api/app/query/house/item`,
  housePictures: `${domain}/api/app/query/house/picture`,
  houseApartments: `${domain}/api/app/query/house/apartments`,
  houseFollow: `${domain}/api/app/protected/follow/house`,
  accesslogs: `${domain}/api/app/query/house/accesslogs`,
  addHouseAccess: `${domain}/api/app/protected/house/addHouseAccess`,
  recommend: `${domain}/api/app/protected/user/recommoned/customer`,
  applyBroker: `${domain}/api/app/protected/user/agent`,
  asyncAccount: `${domain}/api/app/protected/user/wechat/syncAccount`,
  userInfo: `${domain}/api/app/protected/user/info`,
  areaItems: `${domain}/api/app/query/house/areaItems`,
  hotWord: `${domain}/api/app/common/search/word`,
  customerDetail: `${domain}/api/app/protected/mycustomer/detail`,
  followItems: `${domain}/api/app/protected/mycustomer/myfollowItems`,
  timeLine: `${domain}/api/app/protected/mycustomer/followItems`,
  addFollow: `${domain}/api/app/protected/mycustomer/addFollow`,
  myCustomer: `${domain}/api/app/protected/mycustomer/items`,
  myagent: `${domain}/api/app/protected/myagent/items`,
  subAgent: `${domain}/api/app/protected/myagent/subItems`,
  nearbyHouse: `${domain}/api/app/query/recommend/house`,
  totalAgent: `${domain}/api/app/protected/myagent/total`,
  alipay: `${domain}/api/app/protected/alipay/edit`,
  houseCode: `${domain}/api/app/protected/house/scode`,
  openAd: `${domain}/api/app/query/openAd`,
  commission: `${domain}/api/app/protected/user/commission/total`,
  commissionItems: `${domain}/api/app/protected/user/commission/items`,
  bank: `${domain}/api/app/protected/bank/edit`,
  houseTypeItem: `${domain}/api/app/query/house/apartmentItem`,
  withdraw: `${domain}/api/app/protected/user/commission/cash`,
  trends: `${domain}/api/app/query/house/trends`,
  apartmentsInfo: `${domain}/api/app/query/house/apartmentsInfo`,
  policyAgree: `${domain}/api/app/protected/user/consentAgreement`,
  collectCustomer: `${domain}/api/app/protected/user/collect/customer`,
  applyActivityItem: `${domain}/api/app/protected/user/marketRegister/item`,
  applyActivity: `${domain}/api/app/protected/user/marketRegister/register`,
  applyHouseAct: `${domain}/api/app/protected/user/marketHouse/customer`,
  newest: `${domain}/api/app/query/article/newest`, // 最新咨询
  articles: `${domain}/api/app/query/article/items`,
  article: `${domain}/api/app/query/article/item`
}