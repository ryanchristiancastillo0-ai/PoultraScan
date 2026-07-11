import {Route,Routes} from 'react-router-dom'
import Login from '../pages/auth/login/Login';
import Register from '../pages/auth/register/Register';
import ForgotPassword from '../pages/auth/forgot-password/ForgotPassword';
import ResetPassword from '../pages/auth/reset-password/ResetPassword';
import Dashboard from '../pages/dashboard/page/Dashboard';
import FarmDetails from '../pages/farm/page/Farm';
import FarmList from '../pages/farm/page/FarmList';
import ScanHistory from '../pages/scan-history/page/ScanHistory';
import AiScan from '../pages/ai-scan/page/AiScan';
import Journal from '../pages/journal/page/Journal';
import ProtectedRoute from '../middleware/ProtectedRoute';
import Profile from '../pages/profile/page/Profile';
import HomeRedirect from '../middleware/HomeRedirect'
import NotFound from '../pages/not-found/page/NotFound';

export default function AppRoutes(){
    return (
        <Routes>
            <Route path='/' element={<HomeRedirect/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>

            <Route element={<ProtectedRoute/>}>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/farm/:farmId' element={<FarmDetails/>}/>
                <Route path='/farm' element={<FarmList/>}/>
                <Route path='scan/history' element={<ScanHistory/>}/>
                <Route path='/scan' element={<AiScan/>}/>
                <Route path='/journal' element={<Journal/>}/>
                <Route path='/profile' element={<Profile/>}/>
            </Route>
             <Route path='*' element={<NotFound/>}/>
        </Routes>
    )
}