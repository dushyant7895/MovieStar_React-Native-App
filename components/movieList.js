import {View,Text,Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {styles} from '../theme';
import { useNavigation } from '@react-navigation/native';
import { fallbackMoviePoster, image185 } from '../api/moviedb';

var {width, height}=Dimensions.get('window');

export default function MovieList({title,data, hideSeeAll}){
    let movieName = 'Ant-Man and the Waps: Quantumania';
    const navigation =useNavigation();
    return(
        <View style={tw`mb-8`}>
            <View style={tw`mx-4 flex-row justify-between items-center`}>
                <Text style={tw`text-white text-xl`}>{title}</Text>
                {
                    !hideSeeAll && (
                        <TouchableOpacity>
                             <Text style={[styles.text,tw`text-lg`]}>See All</Text>
                        </TouchableOpacity>
                    )
                }
                
            </View>
            <ScrollView 
             horizontal
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={{paddingHorizontal: 15}}
             >
                {
                    data.map((item,index)=>{
                        return (
                            <TouchableWithoutFeedback
                                key={index}
                                onPress={()=> navigation.push('Movie', item)}
                            >
                                <View style={tw`mr-4`}>
                                    <Image
                                        source={{uri: image185(item.poster_path) || fallbackMoviePoster}}
                                        //source={require('../assets/images/peakpx2.jpg')}
                                        style={[tw`rounded-3xl`,
                                        {width: width*0.33,
                                         height: height*0.22}]}
                                    />    
                                    <Text style={tw`text-neutral-300 ml-1`}>
                                        {item.title.length>14? item.title.slice(0,14)+'...': item.title}
                                     </Text>

                                </View>
                                
                            </TouchableWithoutFeedback>
                        )
                    })
                }
             </ScrollView>
        </View>
    )
}