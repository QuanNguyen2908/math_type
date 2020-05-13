import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MathView from 'react-native-math-view';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const App = () => {
  const Login = () => {
    const data = {email: 'admin@opentechiz.com', password: 'admin123'};
    axios
      .post('https://api.opentechiz-cert.just4demo.biz/admin/login', data)
      .then(response => {
        AsyncStorage.setItem('username', response.data.data.username);
        AsyncStorage.setItem('email', response.data.data.email);
        AsyncStorage.setItem('token', response.data.data.token);
        AsyncStorage.setItem('role', response.data.data.role);
      });
  };
  const [dataQuestion, setDataQuestion] = useState('');
  const LoadQuestion = async () => {
    const token = await AsyncStorage.getItem('token');
    const config = {headers: {Authorization: `Bearer ${token}`}};
    axios
      .get(
        'https://api.opentechiz-cert.just4demo.biz/api/question/list',
        config,
      )
      .then(res => {
        setDataQuestion(res.data);
      });
  };
  useEffect(() => {
    Login();
    LoadQuestion();
  }, []);
  console.log('dataQuestion', dataQuestion);
  const dataArr = dataQuestion[6] ? dataQuestion[6].question.split('`') : null;
  return (
    <View>
      {/* {renderQuestion()} */}
      {dataArr !== null &&
        dataArr.map((data, index) => {
          if (data.indexOf('\\') !== -1) {
            return <MathView math={data} key={index} />;
          } else {
            return <Text key={index}>{data}</Text>;
          }
        })}
    </View>
  );
};

const styles = StyleSheet.create({});

export default App;
