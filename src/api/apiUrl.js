export const baseURL = "https://demand.cybercrowdchain.org";
// const baseURL = "http://3.38.197.206:8090";

const reqUrl = {
  allDemandList: `${baseURL}/ccc/demand/all-list`, // 需求列表
  sendProposal: `${baseURL}/ccc/protocol/send_proposal`, // 需求列表-候选人申请

  registerCandidat: `${baseURL}/ccc/candidate/register`, // 注册成为候选人
  addSkillCandidate: `${baseURL}/ccc/candidate/add-skill`, // 新增候选人技能
  deleteSkillCandidate: `${baseURL}/ccc/candidate/delete-skill`, // 删除候选人技能

  allCandidateList: `${baseURL}/ccc/candidate/all-list`, // 候选人列表
  candidateDetail: `${baseURL}/ccc/candidate/detail`, // 候选人详情
  inviteCandidate: `${baseURL}/ccc/protocol/invite-candidate`, // 邀请候选人

  addipfsDemand: `${baseURL}/ccc/demand/add-ipfs`, // 存入ipfs-新建

  employerDemandList: `${baseURL}/ccc/demand/employer-demand-list`, // 个人中心-需求列表
  endDemandCheck: `${baseURL}/ccc/demand/endDemandCheck`, // 个人中心-需求列表-结束操作
  listByDemandProtocol: `${baseURL}/ccc/protocol/list-by-demand`, // 个人中心-需求列表-demand所属protocol列表
  cancelInvitationProtocol: `${baseURL}/ccc/protocol/cancel-invitation`, // 个人中心-需求列表-demand所属protocol列表-取消
  acceptProtocol: `${baseURL}/ccc/protocol/accept-proposal`, // 个人中心-需求列表-demand所属protocol列表-接收
  refuseProtocol: `${baseURL}/ccc/protocol/refuse-proposal`, // 个人中心-需求列表-demand所属protocol列表-拒绝
  listByProtocolMessage: `${baseURL}/ccc/protocol-message/list-by-protocol`, // 个人中心-需求列表-demand所属protocol列表-查看信息
  detailProtocol: `${baseURL}/ccc/protocol/detail`, // 个人中心-需求列表-demand所属protocol列表-接收后的详情列表
  detailDemand: `${baseURL}/ccc/demand/detail`, //

  candidateProtocolList: `${baseURL}/ccc/protocol/candidate-protocol-list`, // 个人中心-作为候选人的protocol列表
  acceptInvitationProtocol: `${baseURL}/ccc/protocol/accept-invitation`, // 个人中心-作为候选人的protocol列表-接收
  refuseInvitationProtocol: `${baseURL}/ccc/protocol/refuse-invitation`, // 个人中心-作为候选人的protocol列表-拒绝
  finishProtocol: `${baseURL}/ccc/protocol/finish-protocol`, // 个人中心-作为候选人的protocol列表-完成

  homepageListData: `${baseURL}/ccc/data/homepage-list`, // 首页-echarts
};

const swapBaseUrl = 'https://api-swap.paths.finance' // 正式
// const swapBaseUrl = 'https://api.paths.finance' // 测试

const swapUrl = {
  publicNode: 'https://transfer.swft.pro/public/node/publicNode',
  getBaseInfo: `${swapBaseUrl}/api/getBaseInfo`,
  multiQuote: `${swapBaseUrl}/api/multiQuote`, // 获取报价
  commonSwap: `${swapBaseUrl}/api/commonSwap`,
  addTransData: `${swapBaseUrl}/api/exchangeRecord/addTransData`,
  getTransDetail: `${swapBaseUrl}/api/exchangeRecord/getTransDetail`,
  getTransData: `${swapBaseUrl}/api/exchangeRecord/getTransData`,
}

export { reqUrl, swapUrl };
