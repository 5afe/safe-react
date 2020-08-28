// To be used if an RSK token source is available
// import axios from 'axios'

// import { getRelayUrl } from 'src/config/index'

// const fetchTokenList = () => {
//   const apiUrl = getRelayUrl()
//   const url = `${apiUrl}tokens/`

//   return axios.get(url, {
//     params: {
//       limit: 3000,
//     },
//   })
// }

// Addresses with ETH checksum to match service response
const fetchTokenList = () => {
  return {
    "data": {
      "count":4,
      "next":null,
      "previous":null,
      "results":[
         {
            "address":"0x2AcC95758f8b5F583470ba265EB685a8F45fC9D5",
            "logoUri":"https://s2.coinmarketcap.com/static/img/coins/32x32/3701.png",
            "default":true,
            "name":"RIF Token",
            "symbol":"RIF",
            "description":"",
            "decimals":18,
            "websiteUri":"",
            "gas":true
         },
         {
            "address":"0xf4d27c56595Ed59B66cC7F03CFF5193e4bd74a61",
            "logoUri":"",
            "default":true,
            "name":"RIFPro",
            "symbol":"RIFP",
            "description":"",
            "decimals":18,
            "websiteUri":"",
            "gas":true
         },
         {
            "address":"0x2d919F19D4892381D58edeBeca66D5642Cef1a1f",
            "logoUri":"",
            "default":true,
            "name":"RIF Dollar on Chain",
            "symbol":"RDOC",
            "description":"",
            "decimals":18,
            "websiteUri":"",
            "gas":true
         },
         {
            "address":"0x440CD83C160De5C96Ddb20246815eA44C7aBBCa8",
            "logoUri":"https://moc-testnet.moneyonchain.com/moc/images/config/icon-riskpro.svg",
            "default":true,
            "name":"BitPRO",
            "symbol":"BITP",
            "description":"",
            "decimals":18,
            "websiteUri":"",
            "gas":true
         },
         {
            "address":"0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db",
            "logoUri":"https://moc-testnet.moneyonchain.com/moc/images/config/icon-stable.svg",
            "default":false,
            "name":"Dollar on Chain",
            "symbol":"DOC",
            "description":"",
            "decimals":18,
            "websiteUri":"",
            "gas":false
         }
      ]
    }
  }
}

export default fetchTokenList
