const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export const getWalletTransactions = async (address) => {
  const url = `https://api-sepolia.etherscan.io/api
    ?module=account
    &action=txlist
    &address=${address}
    &startblock=0
    &endblock=99999999
    &sort=desc
    &apikey=${API_KEY}`.replace(/\s+/g, "");

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "1") {
    return [];
  }

  return data.result;
};
