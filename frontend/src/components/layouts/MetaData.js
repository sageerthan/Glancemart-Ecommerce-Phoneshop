import React from 'react'
import { Helmet } from 'react-helmet-async'
export const MetaData = ({title}) => {
  return (
    <Helmet>
        <title>{`${title} - Glancemart`}</title>
    </Helmet>
  )
}
