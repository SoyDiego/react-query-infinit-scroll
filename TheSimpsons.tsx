import {Text, Image, FlatList, View, Button, TextInput} from 'react-native';
import React, {useState} from 'react';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';

const TheSimpsons = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const getSimpsons = async ({pageParam = 1}) => {
    const res = await axios.get(
      `https://apisimpsons.fly.dev/api/personajes?limit=20&page=${pageParam}`,
    );
    return res.data;
  };

  const querySimpsons = useInfiniteQuery(
    ['simpsons', searchTerm],
    getSimpsons,
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.docs.length === 20 ? allPages.length + 1 : undefined;
        return nextPage;
      },
      select: data => {
        if (!searchTerm) {
          return data;
        }

        const allDocs = data.pages.flatMap(page => page.docs);
        console.log(allDocs);

        const filteredDocs = allDocs.filter(item =>
          item.Nombre.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        console.log(filteredDocs);

        return {
          pageParams: data.pageParams,
          pages: [{docs: filteredDocs}],
        };
      },
    },
  );

  const clearCachedPages = () => {
    queryClient.setQueryData(['simpsons'], existingData => {
      return existingData
        ? {
            pageParams: [existingData.pageParams[0]],
            pages: [existingData.pages[0]],
          }
        : undefined;
    });
  };

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
        <Button
          title="Limpiar cache"
          onPress={() => {
            clearCachedPages();
          }}
        />
      </View>
      <TextInput
        placeholder="Buscar personaje"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
        style={{
          margin: 16,
          padding: 8,
          borderColor: 'gray',
          borderWidth: 1,
        }}
      />
      <FlatList
        onEndReached={() => querySimpsons.fetchNextPage()}
        data={querySimpsons.data?.pages}
        keyExtractor={(page, index) => `page-${index}`}
        renderItem={({item: page}) => (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}>
            {page.docs.map(item => {
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
      />
    </>
  );
};

export default TheSimpsons;
