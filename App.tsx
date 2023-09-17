import {SafeAreaView} from 'react-native';
import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Pokemon from './Pokemon';
import TheSimpsons from './TheSimpsons';
const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView>
        {/* <Pokemon /> */}
        <TheSimpsons />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

export default App;
