import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Dimensions, Image, TouchableWithoutFeedback } from "react-native";
import {View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { XMarkIcon } from "react-native-heroicons/outline";
import tw from'twrnc';
import Loading from "../components/loading";
import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";
import {debounce} from 'lodash';

const {width,height}=Dimensions.get('window');

export default function SearchScreen(){
    const navigation = useNavigation();
    const [results, setResults]=useState([]);
    const [loading, setLoading] = useState(false);
    let movieName = 'Ant-Man and the Waps: Quantumania';
    const handleSearch = value=>{
        if(value && value.length>2){
            setLoading(true);
            searchMovies({
                query: value,
                include_adult: 'false',
                language: 'en-US', 
                page: '1'
            }).then(data=>{
                setLoading(false);
                if(data && data.results) setResults(data.results);
            })
        }else{
            setLoading(false);
            setResults([]);
        }
    }
    const handleTextDebounce= useCallback(debounce(handleSearch, 400), []);
    return(
        <SafeAreaView style={tw`bg-neutral-800 flex-1`}>
            <View style={tw`mx-7 mb-3 mt-6 flex-row justify-between items-center border border-neutral-500 rounded-full`}>
                <TextInput 
                    onChangeText={handleTextDebounce}
                    placeholder='Search Movie'
                    placeholderTextColor={'lightgray'}
                    style={tw`pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider`}
                />
                <TouchableOpacity
                    onPress={()=> navigation.navigate('Home')}
                    style={tw`rounded-full p-3 m-1 bg-neutral-500`}
                >
                    <XMarkIcon size="25" color="white" />
                </TouchableOpacity>
            </View>
            {/* result */}
            {
                loading? (
                    <Loading />
                ):(
                    results.length>0? (
                        <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 15}}
                    style={tw`space-y-3`}>
                        <Text style={tw`text-white font-semibold ml-1`}>Result ({results.length})</Text>
                        <View style={tw`flex-row justify-between flex-wrap`}>
                            {
                                results.map((item, index)=>{
                                    return (
                                        <TouchableWithoutFeedback
                                            key={index}
                                            onPress={()=> navigation.push("Movie",item)}
                                        >
                                            <View style={tw`mb-4`}>
                                            <Image 
                                                //source={require('../assets/images/peakpx2.jpg')}
                                                source={{uri: image185(item?.poster_path) || fallbackMoviePoster}}
                                                style={[tw`rounded-3xl`,{width: width*0.44, height: height*0.3}]}
                                             /> 
                                             <Text style={tw`text-neutral-300 ml-1`}>
                                                {
                                                    item?.title.length>22 ? item?.title.slice(0,22)+'...':item?.title
                                                }
                                             </Text>
                                            </View>
                                              
                                        </TouchableWithoutFeedback>    
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                    ):(
                        <View style={tw`flex-row justify-center`}>
                            <Image source={require('../assets/images/waitingImage.jpg')}
                                style={tw`h-96 w-96 mt-8 rounded-3xl`}
                            />    
    
                        </View>
                    )
                )
            }
           

            

        </SafeAreaView>
    )
}

