import { StorageSync } from "../popup/Popup";
import dummyResponse from "./response.json";

export const fakeData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyResponse);
    }, 2000);
  });
};

// Wrap chrome.storage.sync.set in a Promise
export const setStorageSync = (data: { [key: string]: any }): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

// Wrap chrome.tabs.query in a Promise
export const queryTabs = (
  queryInfo: chrome.tabs.QueryInfo
): Promise<chrome.tabs.Tab[]> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(queryInfo, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs);
      }
    });
  });
};

export const getStorageValue = async <T extends keyof StorageSync>(
  key: T
): Promise<StorageSync[T]> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result[key] as StorageSync[T]);
    });
  });
};
