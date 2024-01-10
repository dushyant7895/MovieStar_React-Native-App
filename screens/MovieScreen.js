import { View,Text, ScrollView, TouchableOpacity, Dimensions, Platform,Image } from 'react-native';
import React, { useEffect,useState } from 'react';
import tw from 'twrnc';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView} from 'react-native';
import { ChevronLeftIcon} from 'react-native-heroicons/outline';
import { HeartIcon} from 'react-native-heroicons/solid';
import {styles, theme} from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import Cast from'../components/cast';
import MovieList from '../components/movieList';
import Loading from '../components/loading';
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, image500, fetchSimilarMovies } from '../api/moviedb';

var {width, height} = Dimensions.get('window');
const ios=Platform.OS =='ios';
const topMargin =ios? '': 'mt-3';

export default function MovieScreen(){
    const {params: item}=useRoute();
    const navigation=useNavigation();
    const [isFavourite, toggleFavourite] = useState(false);
    const [cast,setCast]=useState([]);
    const [similarMovies,setSimilarMovies]=useState([]);
    const [loading, setLoading] = useState(false);
    const [movie,setMovie] = useState({});
    let movieName = 'Ant-Man and the Waps: Quantumania';
    useEffect(()=>{
        //call the movie details from API
       // console.log('itemid',item.id);
        setLoading(true);
        getMovieDetails(item.id);
        getMovieCredits(item.id);
        getSimilarMovies(item.id);
    },[item]);

    const getMovieDetails = async id =>{
        const data = await fetchMovieDetails(id);
        if(data) setMovie(data);
        setLoading(false);
    } 
    const getMovieCredits = async id=>{
        const data=await fetchMovieCredits(id);
        if(data && data.cast) setCast(data.cast);
    }
    const getSimilarMovies = async id=>{
        const data=await fetchSimilarMovies(id);
        if(data && data.results){
            setSimilarMovies(data.results);  
        } 
    }

    return(
        <ScrollView
            contentContainerStyle={{paddingBottom: 40,paddingTop:25}}
            style={tw`flex-1 bg-neutral-900`}
        >
            {/*back botton from movie poster */}
            <View style={tw`w-full`}>
                <SafeAreaView style={tw`absolute z-20 w-full flex-row justify-between items-center px-4 `}>
                    <TouchableOpacity onPress={()=> navigation.goBack()} style={[styles.background,tw`rounded-xl p-1 `]}>
                        <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> toggleFavourite(!isFavourite)}>
                        <HeartIcon size="35" color={isFavourite? theme.background:"white"} />
                    </TouchableOpacity>
                </SafeAreaView>
                {
                    loading? (
                        <Loading />
                    ):(
                                <View>
                            <Image 
                                //source={require('../assets/images/peakpx2.jpg')}
                                source={{uri: image500(movie?.poster_path) || fallbackMoviePoster}}
                                style={{width,height: height*0.55}}
                            />
                            <LinearGradient
                                colors={['transparent','rgba(23,23,23,0.8)','rgba(23,23,23,1)']}
                                style={[{width, height: height*0.4},tw`absolute bottom-0`]}
                                start={{x: 0.5, y: 0}}
                                end={{x: 0.5, y: 1}}
                                />

                        </View>
                    )
                }
                
            </View> 
            {/*movie details  */}
            <View style={[{marginTop: -(height*0.09)},tw`space-y-3`]}>
                {/*title  */}
                <Text style={tw`text-white text-center text-3xl font-bold tracking-wider`}>
                    {
                        movie?.title
                    }
                </Text>
                {/*status, relese, runtime */}
                {
                    movie?.id?(
                        <Text style={tw`text-neutral-400 font-semibold text-base text-center`}>
                             {movie?.status} * {movie?.release_date?.split('-')[0]} * {movie?.runtime} min
                         </Text>
                    ):null
                }

                
                {/* genres */}
                <View style={tw`flex-row justify-center mx-4 space-x-2`}>
                    {
                        movie?.genres?.map((genre, index)=>{
                            let showDot = index+1 != movie.genres.length;
                            return(
                                <Text key={index} style={tw`text-neutral-400 font-semibold text-base text-center`}>
                                    {genre?.name} {showDot? "* ":null}
                                </Text>
                            )
                        })
                    }
                </View>
                <Text style={tw`text-neutral-400 mx-4 tracking-wide`}>
                    {
                        movie?.overview
                    }
                </Text>
            </View> 
            {/* cast */}  
            {cast.length>0 && <Cast navigation={navigation} cast={cast} />}
            {/* similar movies */}
            
               {similarMovies.length>0 && <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovies} />}
            
        </ScrollView>
    )
}
