import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BackLogo, FragmentBook, GiftLogo} from '../../assets/icons/svgIcons';
import FastImage from 'react-native-fast-image';
import SwichButtonComponent from '../../components/buttons/SwichButtonComponent';
import ConstatsApp from '../../constants/ConstatsApp';
import ReviewBar from '../../components/ReviewBar';
import ButtonComponent from '../../components/buttons/ButtonComponent';
import {BookController} from '../../api/controllers/API_Controllers';
import PrimaryItem from '../../components/items/PrimaryItem';
import RenderHTML from 'react-native-render-html';

const BookDetailScreen = ({route, navigation}) => {
  const { width, height } = Dimensions.get('window');
  const [bookType, setBookType] = useState(0);
  const [data, setData] = useState(null);
  const id = route.params;
  const [loading, setLoadting] = useState(true);
  const getData = async () => {
    setLoadting(true);
    try {
      const response = await BookController.get({
        params: {book_id: id, lang: 'ru'},
      });
      const data = response?.data?.data;
      setData(data);
      setLoadting(false);
      console.log(data.book_images);
    } catch (error) {
      console.error(error);
      setLoadting(false);
    }
    setLoadting(false);
  };

  useEffect(() => {
    getData();
    navigation.setOptions({
      title: null,
      headerTransparent: true,
      headerBackTitle: ' ',
      headerBackImage: () => <BackLogo />,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, []);

  const source = {
    html: data?.book_description
  }

  const FragmentButton = () => (
    <TouchableOpacity style={styles.fragmentButton}>
      <FragmentBook />
      <Text style={styles.fragmentText}>Фрагмент</Text>
    </TouchableOpacity>
  );

  const GiftButton = () => {
    return (
      <TouchableOpacity style={styles.giftView}>
        <GiftLogo />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <FastImage
        style={styles.image}
        source={{uri: data?.book_images[0]?.path}}>
        <View style={styles.backgroundView}>
          <Text style={styles.title}>{data?.book_name}</Text>
          <View style={{width: 30, height: 2, backgroundColor: '#FFFFFF'}} />
          <Text style={{color: '#FFFFFF50', fontSize: 17, marginTop: 20}}>
            Пошаговое рукооводство
          </Text>
          <FragmentButton />
        </View>
      </FastImage>
      <View style={styles.view}>
        <SwichButtonComponent
          firstText="Бумага"
          secondText="Электронная"
          thirdText="Аудио"
          firstButtonWidth={95}
          focus={bookType}
          setFocus={setBookType}
          styleBackView={styles.swichButton}
        />
        <Text style={styles.authorInfo}>
          Автор:
          {data?.author.map(item => (
            <TouchableOpacity>
              <Text style={styles.maincolor}>{item?.name}</Text>
            </TouchableOpacity>
          ))}
          {'\n'}
          Из серии: <Text style={styles.maincolor}>TempSeri</Text>
        </Text>
        <ReviewBar />
        <Text style={styles.price}>1 340 т</Text>
        <TouchableOpacity>
          <Text style={styles.rulesText}>
            Ознакомьтесь с правилами доставки
          </Text>
        </TouchableOpacity>
        <View style={styles.buyView}>
          <View style={{flex: 1}}>
            <ButtonComponent buttonText="Купить сейчас" isBold />
          </View>
          <GiftButton />
        </View>
        <View style={styles.cardView}>
          <FastImage
            style={[styles.cardBackGround, {width: 78}]}
            resizeMode={FastImage.resizeMode.center}
            source={require('../../assets/images/VisaLogo.png')}
          />
          <FastImage
            style={[styles.cardBackGround, {flex: 1}]}
            resizeMode={FastImage.resizeMode.center}
            source={require('../../assets/images/MasterCardLogo.png')}
          />
          <FastImage
            style={[styles.cardBackGround, {width: 40, marginRight: 0}]}
            resizeMode={FastImage.resizeMode.center}
            source={require('../../assets/images/QiviLogo.png')}
          />
        </View>
        <Text style={styles.rulesText}>*Қабылданатын төлем жүйелері</Text>
        <Text style={styles.contentTitle}>Анотиция</Text>
        <RenderHTML style={styles.contentText} source={source}/>

        <Text style={styles.contentTitle}>Информация</Text>
        <Text style={styles.contentInfo}>
          Количество страниц: <Text style={styles.contentInlet}>{data?.page_quanity}</Text>
          {'\n'}
          ISBN: <Text style={styles.contentInlet}>{data?.isbn}</Text>
          {'\n'}
          Год выпуска: <Text style={styles.contentInlet}>{data?.year}</Text>
          {'\n'}
          Имеется: <Text style={styles.contentInlet}>{data?.available}</Text>
          {'\n'}
          Доставка: <Text style={styles.contentInlet}>{null}</Text>
        </Text>
        <Text style={styles.contentTitle}>С этой книгой читают</Text>
        <FlatList
          data={data?.more_book}
          renderItem={({item}) => <PrimaryItem item={item} Event={() => navigation.push('BookDetailScreen', {item: item?.id})}/>}
          horizontal
        />
      </View>
    </ScrollView>
  );
};

export default BookDetailScreen;

const styles = StyleSheet.create({
  view: {
    height: '100%',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#FFFFFF',
  },
  image: {
    backgroundColor: 'green',
    width: '100%',
    height: 395,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  fragmentButton: {
    height: 32,
    width: 131,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  fragmentText: {
    marginLeft: 12,
    fontSize: 17,
    color: '#333333',
  },
  swichButton: {
    marginBottom: 20,
  },
  authorInfoView: {},
  authorInfo: {
    fontSize: 15,
    marginBottom: 20,
  },
  maincolor: {
    color: ConstatsApp.mainColor,
  },
  price: {
    fontSize: 32,
    marginTop: 20,
  },
  rulesText: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
    color: '#777777',
  },
  giftView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: 70,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8D287633',
    marginLeft: 20,
  },
  buyView: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cardView: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  cardBackGround: {
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: 10,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contentText: {
    fontSize: 17,
    marginBottom: 20,
  },
  contentInlet: {
    fontSize: 17,
    color: '#333333',
  },
  contentInfo: {
    color: '#777777',
    marginBottom: 20,
  },
  backgroundView: {
    backgroundColor: '#111111CC',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
