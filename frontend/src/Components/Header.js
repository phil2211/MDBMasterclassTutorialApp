import { RealmLogoLockup, AtlasLogoLockup } from '@leafygreen-ui/logo';
import * as React from 'react';

const Header = () => {
    return (
        <div style={{margin: 20}}>
            <AtlasLogoLockup />
            <span style={{marginRight: 20}} />
            <RealmLogoLockup />
        </div>
        
    );
};

export default Header;