import {
  closeAccount,
  getWalletAddr,
  openWallet,
  resetProcessingWallet,
} from "@Redux/actions/wallet";
import { useDispatch, useSelector } from "react-redux";

import AddrTransactions from "@Components/AddrTransactions";
import AppLayout from "@Components/Layout/AppLayout";
import ControlledTabs from "@Components/Tabs";
import Deployer from "@Components/Deployer";
import Head from "next/head";
import Interactor from "@Components/Interactor";
import Loading from "@Components/Loading";
import type { NextPage } from "next";
import OwnedToken from "@Components/OwnedToken";
import React from "react";
import Sender from "@Components/Sender";
import _ from "lodash";
import { convertWithDecimals } from "@Utils/functions";
import styles from "@Styles/Home.module.css";
import { useRouter } from "next/router";

const WalletAccount: NextPage = () => {
  const dispatch = useDispatch();
  const [queryId, $queryId] = React.useState<any | null>("");
  const [privateKey, $privateKey] = React.useState<any | null>("");
  const router = useRouter();
  const { account, accountBalance, isLoading, isProcessing, receipt, addr } =
    useSelector((state: any) => state.wallet) || {};

  React.useEffect(() => {
    let key = JSON.parse(localStorage.getItem("privateKey") || "{}");
    if (key) $privateKey(key);
  }, []);

  React.useEffect(() => {
    const { query } = router;
    if (query?.addrHash) {
      const { addrHash } = query;
      $queryId(addrHash);
    }
  }, [router]);

  React.useEffect(() => {
    if (queryId) {
      dispatch(getWalletAddr({ addrHash: queryId }));
    }
  }, [queryId]);

  React.useEffect(() => {
    if (privateKey) {
      dispatch(openWallet({ privateKey }));
    }
  }, [privateKey]);

  const closeAccountWallet = () => {
    dispatch(closeAccount({ account: null, accountBalance: null }));
    router.push("/wallet");
  };

  const resetProcessing = () => {
    dispatch(resetProcessingWallet({ receipt: null }));
  };

  const tabs = [
    {
      title: "Tokens Held",
      description: "Balance of tokens held by this account.",
      eventKey: "owned_tokens",
      renderTab: () => <OwnedToken addrHash={queryId} showPagination={false} />,
      isRender: true,
      isShowDes: false,
    },
    {
      title: "Transactions",
      eventKey: "transactions",
      renderTab: () => <AddrTransactions addrHash={queryId} />,
      isRender: addr,
      isShowDes: false,
    },
    {
      title: "Send GO",
      eventKey: "send_go",
      renderTab: () => <Sender addrHash={queryId} />,
      isRender: !isProcessing,
      isShowDes: false,
    },
    {
      title: "Deploy Contract",
      eventKey: "deploy_contract",
      renderTab: () => <Deployer addrHash={queryId} />,
      isRender: true,
      isShowDes: false,
    },
    {
      title: "Use Contract",
      eventKey: "use_contract",
      renderTab: () => <Interactor addrHash={queryId} />,
      isRender: true,
      isShowDes: false,
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Wallet - GoChain Explorer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {account && (
              <div className="container">
                <div className="card">
                  <div className="card-body">
                    <div className="card-title">
                      <img src="../../../assets/icons/user.svg" alt="Account" />{" "}
                      ACCOUNT
                    </div>
                    <p>Address: {account?.address || addr?.address}</p>
                    <p>
                      Balance (GO):{" "}
                      <span className="text-monospace">
                        {convertWithDecimals(_.toNumber(accountBalance || 0))}
                      </span>
                    </p>
                    <p>
                      <button
                        type="button"
                        className="btn btn-outline-info btn-sm"
                        onClick={() => closeAccountWallet()}
                      >
                        CLOSE WALLET
                      </button>
                    </p>
                  </div>
                </div>

                <div className="card mt-4 mb-5">
                  <div className="card-body">
                    <ControlledTabs disabled={isProcessing} tabs={tabs} />

                    {isProcessing && (
                      <>
                        {receipt ? (
                          <>
                            <div className="processing__icon">
                              <img
                                src="../../../assets/icons/loader.svg"
                                alt="Processing"
                              />
                            </div>
                            <div className="processing__content mt-4">
                              Transaction submitted, waiting for receipt...
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="receipt">
                              <div className="receipt__header text-center h4 text-primary mb-4">
                                Transaction complete!
                              </div>
                              <div className="receipt__content mb-4">
                                <div className="row">
                                  <div className="col-md-2">
                                    Transaction Hash:
                                  </div>
                                  <div className="col-md-10">
                                    <a
                                      href={`/tx/${receipt?.transactionHash}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {receipt?.transactionHash}
                                    </a>
                                  </div>
                                  <div className="col-md-2">Block Hash:</div>
                                  <div className="col-md-10">
                                    <a
                                      href={`/block/${receipt?.blockHash}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {receipt?.blockHash}
                                    </a>
                                  </div>
                                  {receipt?.contractAddress && (
                                    <>
                                      <div className="col-md-2">
                                        Contract Address:
                                      </div>
                                      <div className="col-md-10">
                                        <a
                                          href={`/address/${receipt?.contractAddress}`}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {receipt?.contractAddress}
                                        </a>
                                      </div>
                                    </>
                                  )}
                                  <div className="col-md-2">Gas Used:</div>
                                  <div className="col-md-10">
                                    {receipt?.gasUsed}
                                  </div>
                                </div>
                              </div>
                              <div className="receipt__footer text-right">
                                <button
                                  onClick={() => resetProcessing()}
                                  className="btn btn-primary"
                                >
                                  Go back
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </AppLayout>
    </div>
  );
};

export default WalletAccount;
