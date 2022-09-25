import WalletConnectProvider from '@walletconnect/web3-provider';
import { providers } from 'ethers';
import Head from 'next/head';
import { useCallback, useEffect, useReducer } from 'react';
import WalletLink from 'walletlink';
import Web3Modal from 'web3modal';
import { ellipseAddress, getChainData } from '../lib/utilities';

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID // required
    }
  }
};

export let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions // required
  });
}

type StateType = {
  provider?: any;
  web3Provider?: any;
  address?: string;
  chainId?: number;
};

type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER';
      provider?: StateType['provider'];
      web3Provider?: StateType['web3Provider'];
      address?: StateType['address'];
      chainId?: StateType['chainId'];
    }
  | {
      type: 'SET_ADDRESS';
      address?: StateType['address'];
    }
  | {
      type: 'SET_CHAIN_ID';
      chainId?: StateType['chainId'];
    }
  | {
      type: 'RESET_WEB3_PROVIDER';
    };

export const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null
};

export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address
      };
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId
      };
    case 'RESET_WEB3_PROVIDER':
      return initialState;
    default:
      throw new Error();
  }
}
