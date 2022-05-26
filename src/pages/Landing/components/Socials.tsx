import {
  Link,
  SocialNetworksType,
  socialNetworksLinks
} from '@gravis.finance/uikit'
import React, { CSSProperties, FC } from 'react'
import styled from 'styled-components'

import DISCORD_ICON from 'assets/images/socials/discord.svg'
import EMAIL_ICON from 'assets/images/socials/email.svg'
import GITHUB_ICON from 'assets/images/socials/github.svg'
import MEDIUM_ICON from 'assets/images/socials/medium.svg'
import TELEGRAM_ICON from 'assets/images/socials/telegram.svg'
import TWITTER_ICON from 'assets/images/socials/twitter.svg'

import { Image } from './layouts'

const SOCIALS = {
  GITHUB: {
    image: GITHUB_ICON,
    to: socialNetworksLinks[SocialNetworksType.GITHUB],
    alt: 'github'
  },
  TELEGRAM: {
    image: TELEGRAM_ICON,
    to: socialNetworksLinks[SocialNetworksType.TELEGRAM],
    alt: 'telegram'
  },
  TWITTER: {
    image: TWITTER_ICON,
    to: socialNetworksLinks[SocialNetworksType.TWITTER],
    alt: 'twitter'
  },
  MEDIUM: {
    image: MEDIUM_ICON,
    to: socialNetworksLinks[SocialNetworksType.MEDIUM],
    alt: 'medium'
  },
  DISCORD: {
    image: DISCORD_ICON,
    to: socialNetworksLinks[SocialNetworksType.DISCORD],
    alt: 'discord'
  },
  EMAIL: {
    image: EMAIL_ICON,
    to: 'mailto: info@gravis.finance',
    alt: 'email'
  }
}

export const SOCIALS_LIST = Object.values(SOCIALS)

const Wrapper = styled.div`
  display: flex;
  column-gap: 10px;
  flex-wrap: wrap;

  @media screen and (max-width: 1170px) {
    justify-content: center;
    width: 100%;
    order: -1;
  }

  @media screen and (max-width: 400px) {
    column-gap: 5px;
  }

  @media screen and (max-width: 370px) {
    max-width: 240px;
    row-gap: 5px;
  }
`

const StyledLink = styled(Link)`
  :hover ${Image} img {
    filter: contrast(0.5);
  }
`

type Props = {
  size?: number
  style?: CSSProperties
  linkStyle?: CSSProperties
  list: {
    image: string
    to: string
    alt: string
    onClick?: () => unknown
  }[]
}

const Socials: FC<Props> = ({ list, size = 60, style, linkStyle }) => {
  return (
    <Wrapper style={style}>
      {list.map(({ to, image, alt, onClick }) => (
        <StyledLink
          aria-label={alt}
          style={linkStyle}
          onClick={onClick}
          key={to}
          target="_blank"
          href={to}
        >
          <Image alt={alt} src={image} width={size} height={size} />
        </StyledLink>
      ))}
    </Wrapper>
  )
}

export default Socials
