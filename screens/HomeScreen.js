import { SafeAreaView } from "react-native-safe-area-context";
import{Text,View,Plateform, TouchableOpacity, ScrollView} from 'react-native';
import React,{useEffect, useState} from "react";
import tw from 'twrnc';
import { StatusBar } from "expo-status-bar";
import{ Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import {styles} from '../theme';
import TrendingMovies from "../components/trendingMovies";
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import { fetchTrendingMovies } from "../api/moviedb";
import { fetchUpcomingMovies } from "../api/moviedb";
import { fetchTopRatedMovies } from "../api/moviedb";

export default function HomeScreen(){
    const [trending, setTrending] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [topRated, setTopRated] = useState([]); 
    const [loading, setLoading] = useState(true);
    const navigation= useNavigation();   

    useEffect(()=>{
        getTrendingMovies();
        getUpcomingMovies();
        getTopRatedMovies();
    },[])

    const getTrendingMovies=async ()=>{
        const data = await fetchTrendingMovies();
        //console.log('got trending movies: ',data);
        if(data && data.results) setTrending(data.results);
        setLoading(false);
    }
    const getUpcomingMovies=async ()=>{
        const data = await fetchUpcomingMovies();
       // console.log('got trending movies: ',data);
        if(data && data.results) setUpcoming(data.results);
        setLoading(false);
    }
    const getTopRatedMovies=async ()=>{
        const data = await fetchTopRatedMovies();
        //console.log('got trending movies: ',data);
        if(data && data.results) setTopRated(data.results);
       
    }

    return(
        <View style={tw`flex-1 bg-neutral-800`}>
            <SafeAreaView style={tw`mb-3`}>
                <StatusBar style="light"/>
                <View style={tw`flex-row justify-between items-center mx-4`}>
                    <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
                    <Text style={tw`text-white text-3xl font-bold`}>
                        <Text style={styles.text}>Movie</Text>Star
                    </Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('Search')}>
                        <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {
                loading? (
                    <Loading />
                ):(
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 10}}
                >
                    {/* Trending Movies carousel*/}
                    {trending.length>0 && <TrendingMovies data={trending} />}
    
                    {/*upcoming Movies */}
                    <MovieList title="Upcoming" data={upcoming} />
    
                     {/*Top rated Movies */}
                     <MovieList title="Top Rated" data={topRated} />
    
                    </ScrollView>
                )
            }
           
        </View>
    )
}