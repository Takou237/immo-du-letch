/**
 * ListingImage — affiche la photo réelle du bien (API ou asset web) avec fallback
 * automatique vers le fond coloré + icône vectorielle si hors-ligne ou erreur réseau.
 */
import React, { useState } from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { PropertyType } from '../types/listing';
import { PropertyTypeIcon } from './PropertyTypeIcon';

const DEFAULT_WEB_IMAGES: Record<PropertyType, string> = {
  villa: 'https://immo-du-letch-eosin.vercel.app/assets/26532.png',
  appartement: 'https://immo-du-letch-eosin.vercel.app/assets/d92fa.png',
  terrain: 'https://immo-du-letch-eosin.vercel.app/assets/024df.png',
  studio: 'https://immo-du-letch-eosin.vercel.app/assets/9f819.png',
  bureau: 'https://immo-du-letch-eosin.vercel.app/assets/d8a71.png',
};

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
  const resolvedUri = uri || DEFAULT_WEB_IMAGES[type];
  const showImage = Boolean(resolvedUri) && !failed;

  return (
    <View style={[styles.container, { backgroundColor: fallbackColor }, style]}>
      {showImage ? (
        <Image
          source={{ uri: resolvedUri }}
          style={StyleSheet.absoluteFill}
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
