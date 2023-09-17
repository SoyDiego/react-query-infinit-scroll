/* eslint-disable react-native/no-inline-styles */

import {Text, Image, FlatList, View} from 'react-native';
import React from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import axios from 'axios';

const TheSimpsons = () => {
  const getSimpsons = async ({pageParam = 1}) => {
    const res = await axios.get(
      `https://apisimpsons.fly.dev/api/personajes?limit=20&page=${pageParam}`,
    );
    return res.data;
  };

  const querySimpsons = useInfiniteQuery(['simpsons'], getSimpsons, {
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.docs.length === 20 ? allPages.length + 1 : undefined;
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
          MOSTRANDO {querySimpsons.data?.pages.length! * 20} PERSONAJES
        </Text>
      </View>
      <FlatList
        data={querySimpsons.data?.pages}
        keyExtractor={(page, index) => `page-${index}`}
        renderItem={({item: page}) => (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}>
            {page.docs.map((item: any) => {
              return (
                <View
                  key={item.Nombre}
                  style={{
                    gap: 8,
                  }}>
                  <Image
                    source={{uri: item.Imagen}}
                    style={{width: 120, height: 120, resizeMode: 'contain'}}
                  />
                  <Text
                    key={item.Nombre}
                    style={{
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    {item.Nombre}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        onEndReached={() => querySimpsons.fetchNextPage()}
      />
    </>
  );
};

export default TheSimpsons;
