import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Asset } from 'expo-asset';
import { ModelView } from 'react-native-3d-model-view';

const ModelScreen = () => {
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const modelAsset = Asset.fromModule(require('./Tomato.obj'));
      await modelAsset.downloadAsync();
      setModelLoaded(true);
    };

    loadModel();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {modelLoaded ? (
        <ModelView
          style={{ flex: 1 }}
          source={{ uri: Asset.fromModule(require('./Tomato.obj')).uri }}
        />
      ) : (
        <Text>Loading model...</Text>
      )}
    </View>
  );
};

export default ModelScreen;
