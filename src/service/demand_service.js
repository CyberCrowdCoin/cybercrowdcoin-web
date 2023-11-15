import { ethers } from "ethers";
import axios from "axios";
import CCCJson from "./contracts/CCC.json";
import CCCWebJson from "./contracts/CCCWeb.json";

import { reqUrl } from "@/api/apiUrl";

let selection = 0; // 默认选择第一个配置

if (process.env.NODE_ENV === "production") {
  // 如果是线上环境，选择不同的配置
  selection = 1; // 选择第二个配置
}

const cccWebConfigs = [
  {
    address: "0x5F19a5Bd51517329a99a3BaC59cBe8acEdd7113d",
    rpcurl: "https://goerli.infura.io/v3/d445a41d8182464696de9e9c91db3776",
    gas: 3000000,
  },
  {
    address: "0x5F19a5Bd51517329a99a3BaC59cBe8acEdd7113d", // 添加线上环境的配置
    rpcurl: "https://goerli.infura.io/v3/d445a41d8182464696de9e9c91db3776", // 添加线上环境的RPC URL
    gas: 3000000, // 添加线上环境的gas限制
  },
];

const cccConfigs = [
  {
    address: "0x1c3D6826624Fe9B22C13CF7afBc9eee78bc095CE",
  },
  {
    address: "0x1c3D6826624Fe9B22C13CF7afBc9eee78bc095CE", // 添加线上环境的配置
  },
];

const cccWebConfig = () => cccWebConfigs[selection];

const cccConfig = () => cccConfigs[selection];

function getTokenValue(tokenAmount) {
  const tokenValue = {
    value: parseInt(tokenAmount),
    token: {
      tokenId: 12345,
      tokenContract: { tokenType: 1, tokenAddress: cccConfig().address },
    },
  };
  return tokenValue;
}

const getCurrentProvider = async () => {
  if (typeof window.ethereum !== "undefined") {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    return web3Provider;
  } else {
    const provider = new ethers.providers.JsonRpcProvider(
      cccWebConfig().rpcurl
    );
    return provider;
  }
};

const cccContract = async () => {
  const provider = await getCurrentProvider();
  // 导入签名
  const signer = provider.getSigner();
  // 获取合约，参数：contractAddress、contractABI、signer
  const contract = new ethers.Contract(
    cccConfig().address,
    CCCJson.abi,
    signer
  );
  return contract;
};

const approve = async (tokenAmount) => {
  try {
    const contract = await cccContract();
    const receipt = await contract.approve(cccWebConfig().address, tokenAmount);
    await receipt.wait();

    console.log("approve Transaction Receipt:", receipt);
  } catch (error) {
    console.error("approve Transaction Error:", error);
  }
};

const cccWebContract = async () => {
  const provider = await getCurrentProvider();
  // 导入签名
  const signer = provider.getSigner();
  // 获取合约，参数：contractAddress、contractABI、signer
  const contract = new ethers.Contract(
    cccWebConfig().address,
    CCCWebJson.abi,
    signer
  );
  return contract;
};

const protocolDetail = async (id) => {
  const result = await axios.get(`${reqUrl.detailProtocol}?id=` + id);
  if (result.data.success) {
    return result.data.data;
  } else {
    return null;
  }
};

const createDemandContract = async (demand) => {
  var userAccount = localStorage.getItem("userName");
  var tokenValue = getTokenValue(demand.tokenAmount);
  // 将字符串转换为 UTF-8 编码的字节数组
  const utf8Bytes = ethers.utils.toUtf8Bytes(JSON.stringify(demand));
  // 将字节数组转换为十六进制字符串
  const demandBytes = ethers.utils.hexlify(utf8Bytes);
  try {
    const contract = await cccWebContract();
    const receipt = await contract.createDemand(
      userAccount,
      tokenValue,
      demandBytes
    );
    console.info("transactionHash:" + receipt.hash);
    return receipt.hash;
  } catch (error) {
    // 告诉用户合约失败了
    this.$message.error("createDemand error----->", error);
    return null;
  }
};

// 结束操作
const demandDetail = async (contract) => {
  const result = await axios.get(`${reqUrl.detailDemand}?contract=` + contract);
  if (result.data.success) {
    return result.data.data;
  } else {
    return null;
  }
};

const endDemandContract = async (demandAddress, tokenAmount) => {
  var userAccount = localStorage.getItem("userName");
  var tokenValue = getTokenValue(tokenAmount);
  try {
    const contract = await cccWebContract();
    const receipt = await contract.endDemand(
      demandAddress,
      userAccount,
      tokenValue
    );
    console.info("endDemand transactionHash:" + receipt.hash);
    return receipt.hash;
  } catch (error) {
    // 告诉用户合约失败了
    console.error("endDemand error----->", error);
    return null;
  }
};

// 接收邀请操作连接合约
const addCandidateContract = async (protocolId, ipfsUrl) => {
  try {
    const contract = await cccWebContract();
    const protocolData = await protocolDetail(protocolId);

    // 将字符串转换为 UTF-8 编码的字节数组
    const utf8Bytes = ethers.utils.toUtf8Bytes(ipfsUrl);
    // 将字节数组转换为十六进制字符串
    const ipfsUrlBytes = ethers.utils.hexlify(utf8Bytes);
    const receipt = await contract.addCandidate(
      protocolData.contract,
      protocolData.candidate,
      ipfsUrlBytes,
      protocolId
    );
    console.info("addCandidate transactionHash:" + receipt.hash);
    return receipt.hash;
  } catch (error) {
    // 告诉用户合约失败了
    console.error("addCandidate error----->", error);
    return null;
  }
};
export {
  approve,
  createDemandContract,
  demandDetail,
  endDemandContract,
  addCandidateContract,
};
