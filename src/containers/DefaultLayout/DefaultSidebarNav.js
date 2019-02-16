import React from 'react';
import { AppSidebarNav } from '@coreui/react';
import Can from '../../utils/Casl/Can';

class DefaultSidebarNav extends AppSidebarNav {

    navType(item, idx) {
        return (
            <Can do={item.action} on={item.subject} key={item.name}>
                {super.navType(item, idx)}
            </Can>
        );
    }
}

export default DefaultSidebarNav;