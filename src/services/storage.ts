import AsyncStorage from '@react-native-async-storage/async-storage';

async function save<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function getValueFor<T>(key: string) {
  let result = await AsyncStorage.getItem(key);

  if (result) return JSON.parse(result) as T;
  else return null;
}

async function deleteValueFor(key: string) {
  await AsyncStorage.removeItem(key);
}

export default {
  save,
  getValueFor,
  deleteValueFor,
};
