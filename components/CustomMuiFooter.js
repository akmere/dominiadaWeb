import { GridPagination } from "@mui/x-data-grid";

import React from 'react'

export default function CustomMuiFooter({subtitle}) {
  return (
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <p style={{fontWeight:'bold', marginInline:'1rem', overflow:'hidden', flexShrink: 10}}>{subtitle}</p>
        <GridPagination style={{justifySelf: 'end'}}/>
    </div>
  )
}

// style={{display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}