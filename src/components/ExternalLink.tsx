import React from 'react';
import { Link, type Href } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Empêche l'ouverture dans le navigateur natif sur mobile
          event.preventDefault();
          // Ouvre le lien dans une WebView
          await openBrowserAsync(href.toString());
        }
      }}
    />
  );
}
