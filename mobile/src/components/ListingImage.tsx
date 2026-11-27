/**
 * ListingImage — affiche la photo réelle du bien avec fallback automatique
 * vers le fond coloré + icône vectorielle si hors-ligne ou erreur réseau.
 */
import React, { useState } from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { PropertyType } from '../types/listing';
import { PropertyTypeIcon } from './PropertyTypeIcon';

interface ListingImageProps {
  uri?: string;
  type: PropertyType;
  fallbackColor: string;
  iconSize?: number;
  style?: ViewStyle;
}

export function ListingImage({
  uri,
  type,
  fallbackColor,
  iconSize = 28,
  style,
}: ListingImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;

  return (
    <View style={[styles.container, { backgroundColor: fallbackColor }, style]}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={styles.fallbackCenter}>
          <PropertyTypeIcon type={type} size={iconSize} color="rgba(255,255,255,0.88)" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackCenter: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    padding: 10,
  },
});
