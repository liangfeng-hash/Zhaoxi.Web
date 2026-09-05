
import {
    CirclePlusFilled,
    Search,
    DeleteFilled,
    Edit,
    WarnTriangleFilled,
    Lock,
    Switch,
    Menu,
    UserFilled,
    Tools,
    User,
    Share


} from '@element-plus/icons-vue'





export const initIcon = (stricon) => {
    if (stricon == "CirclePlusFilled") {
        return CirclePlusFilled;
    }
    else if (stricon == "Search") {
        return Search;
    } 
    else if (stricon == "DeleteFilled") {
        return DeleteFilled;
    }
    else if (stricon == "Edit") {
        return Edit;
    } 
    else if (stricon == "WarnTriangleFilled") {
        return WarnTriangleFilled;
    } 
    else if (stricon == "Lock") {
        return Lock;
    }  
    else if (stricon == "Switch") {
        return Switch;
    }  
    else if (stricon == "Menu") {
        return Menu;
    }  
    else if (stricon == "UserFilled") {
        return UserFilled;
    }  
    else if (stricon == "Tools") {
        return Tools;
    }  
    else if (stricon == "User") {
        return User;
    }  
    else if (stricon == "Share") {
        return Share;
    }  
    
    

    
    
    
}

export const iconList = () => {
    return ['CirclePlusFilled', 'Search','DeleteFilled','Edit',
    'WarnTriangleFilled','Lock','Switch','Menu','UserFilled','Tools','User','Share']
}





// 接口地址统一从环境变量读取
// 开发：.env.development   生产：.env.production
// 换域名 / 换 IP 只改 .env 文件，不用改代码、不用重新编译逻辑
export const baseURL = () => import.meta.env.VITE_API_BASE
export const authURL = () => import.meta.env.VITE_AUTH_BASE
export const apiUrl = () => `${baseURL()}api/`







