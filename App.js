import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import MathView from 'react-native-math-view';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const window = Dimensions.get('window');

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
  const [idSubject, setIdSubject] = useState('');

  const LoadQuestion = async () => {
    const token = await AsyncStorage.getItem('token');
    const config = {headers: {Authorization: `Bearer ${token}`}};
    const data = {name: 'Toán'};
    const response = await axios.post(
      'https://api.opentechiz-cert.just4demo.biz/api/subject/name',
      data,
      config,
    );
    const dataQ = await axios.post(
      'https://api.opentechiz-cert.just4demo.biz/api/question/subject',
      {ID: response.data.ID},
      config,
    );
    setDataQuestion(dataQ.data);
    //console.log (dataQ.data)
    // axios
    //   .get(
    //     'https://api.opentechiz-cert.just4demo.biz/api/question/list',
    //     config,
    //   )
    //   .then(res => {
    //     setDataQuestion(res.data);
    //   });
  };
  useEffect(() => {
    Login();
    LoadQuestion();
  }, []);
  // const renderQuestion = () => {
  //   return (
  //     <View>
  //       {dataQuestion !== '' &&
  //         dataQuestion.map((item, index) => {
  //           const dataArr = item.question.split('`');
  //           return (
  //             <View style={styles.viewQuestion} key={index}>
  //               <Text>Câu {index+1} : </Text>
  //               {dataArr.map((item, index) => {
  //                 if (item.indexOf('\\') !== -1) {
  //                   return <MathView math={item} key={index} />;
  //                 } else {
  //                   return <Text key={index}>{item}</Text>;
  //                 }
  //               })}
  //             </View>
  //           );
  //         })}
  //     </View>
  //   );
  const renderAnswer = (item, index) =>{
    const dataAnswer = item.content.split('`')
    return(
      <View style={styles.viewQuestion} key={index}>
        <Text>{item.label}.  </Text>
        {
          dataAnswer.map((item, index) => {
            if (item.indexOf('\\') !== -1) {
              return <MathView math={item} key={index} />;
            } else {
              return <Text key={index}>{item}</Text>;
            }
          })
        }

      </View>
    )
  }

  const renderQuestion = (item, index) => {
    if (item) {
      const dataArr = item.question.split('`');
      const dataOption = item.options
      //const dataTest = item.options.content.split('`')
      return (
        <View key={item.ID}>
          <View style={styles.viewQuestion}>
            <Text> Cau hoi : {index + 1} </Text>
            {dataArr.map((item, index) => {
              if (item.indexOf('\\') !== -1) {
                return <MathView math={item} key={index} />;
              } else {
                return <Text key={index}>{item}</Text>;
              }
            })}
          </View>
          <View>
            <FlatList
            data={dataOption}
            renderItem={({item, index}) => renderAnswer(item, index)}
            keyExtractor={item => item.label}
          />
          </View>
        </View>
      );
    }

    // return (

    //   <View>
    //     {/* {dataQuestion !== '' &&
    //       dataQuestion.map((item, index) => {
    //         const dataArr = item.question.split('`');
    //         return (
    //           <View style={styles.viewQuestion} key={index}>
    //             <Text>Câu {index+1} : </Text>
    //             {dataArr.map((item, index) => {
    //               if (item.indexOf('\\') !== -1) {
    //                 return <MathView math={item} key={index} />;
    //               } else {
    //                 return <Text key={index}>{item}</Text>;
    //               }
    //             })}
    //           </View>
    //         );
    //       })} */}
    //   </View>
    // );
  };
  return (
    <View style={styles.container}>
      {/* <ScrollView>{renderQuestion()}</ScrollView> */}
      {/* <ScrollView> */}
        <FlatList
          data={dataQuestion}
          renderItem={({item, index}) => renderQuestion(item,index)}
          keyExtractor={item => item.ID}
        />
      {/* </ScrollView> */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  viewQuestion: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});

export default App;
