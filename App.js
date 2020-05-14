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
  console.log(dataQuestion);
  const renderQuestion = () => {
    return (
      <View>
        {dataQuestion !== '' &&
          dataQuestion.map((item, index) => {
            const dataArr = item.question.split('`');
            return dataArr.map((item, index) => {
              if (item.indexOf('\\') !== -1) {
                console.log(item);
                return <MathView math={item} key={index} />;
              } else {
                console.log(item);
                return <Text key={index}>{item}</Text>;
              }
            });
          })}
      </View>
    );
  };
  return <View>{renderQuestion()}</View>;
};

const styles = StyleSheet.create({});

export default App;
