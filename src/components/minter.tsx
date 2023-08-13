import { useState, useEffect } from 'react';
import { BigNumber, ethers } from "ethers";
import abi from "../utils/abi.json"
import { 
  IPaymaster, 
  BiconomyPaymaster, 
  IHybridPaymaster, 
  SponsorUserOperationDto,
  PaymasterMode
} from '@biconomy/paymaster'
import styles from '@/styles/Home.module.css'

const nftAddress = "0x0a7755bDfb86109D9D403005741b415765EAf1Bc"

const Minter = ({ smartAccount, address, provider }:any) => {
  // const [nftContract, setNFTContract] = useState({})
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  console.log({ address, smartAccount})

  const handleMint = async () => {
    const contract = new ethers.Contract(
      nftAddress,
      abi,
      provider,
    )
    try {
      setMinting(true)
      // toast.info('Creating your claim...', {
      //   position: "top-right",
      //   autoClose: 15000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "dark",
      //   });
      const minTx = await contract.populateTransaction.mint();
      const tx1 = {
        to: nftAddress,
        data: minTx.data,
      };
      console.log("here before userop")
      let userOp = await smartAccount.buildUserOp([tx1]);
      console.log("after op")
      console.log({ userOp })
      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      setMinting(false)
      setMinted(true)
      // toast.success('Claim sent on this transaction: receipt.transactionHash', {
      //   position: "top-right",
      //   autoClose: 15000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "dark",
      //   });
    } catch (err: any) {
      setMinting(false)
      console.error(err);
      console.log(err)
    }
  }
  return(
    <>
    {address && <h2>Welcome {address}</h2>}
    {address && <button onClick={handleMint} className={styles.connect}>Mint NFT</button>}
    </>
  )
}

export default Minter;
