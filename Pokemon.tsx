/* eslint-disable react-native/no-inline-styles */

import {Text, Image, FlatList, View} from 'react-native';
import React from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import axios from 'axios';

const Pokemon = () => {
  const getPokemon = async ({pageParam = 0}) => {
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pageParam}`,
    );
    return res.data;
  };

  const queryPokemon = useInfiniteQuery({
    queryKey: ['pokemons'],
    queryFn: getPokemon,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.results.length === 20 ? allPages.length * 20 : undefined;
      return nextPage;
    },
  });

  return (
    <>
      <View
        style={{
          backgroundColor: 'green',
        }}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            paddingVertical: 8,
          }}>
          MOSTRANDO {queryPokemon.data?.pages.length! * 20} POKEMONES
        </Text>
      </View>
      <FlatList
        data={queryPokemon.data?.pages}
        keyExtractor={(page, index) => `page-${index}`}
        renderItem={({item: page}) => (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}>
            {page.results.map((pokemon: any) => {
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url
                .split('/')
                .slice(-2, -1)}.png`;

              return (
                <View
                  key={pokemon.name}
                  style={{
                    gap: 8,
                  }}>
                  <Image
                    source={{uri: imageUrl}}
                    style={{width: 120, height: 120}}
                  />
                  <Text
                    key={pokemon.name}
                    style={{
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    {pokemon.name}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        onEndReached={() => queryPokemon.fetchNextPage()}
      />
    </>
  );
};

export default Pokemon;
