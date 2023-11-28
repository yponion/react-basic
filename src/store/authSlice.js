import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const authSlice = createSlice({ //createSlice를 통해 state를 정의
    name: 'auth',
    initialState,
    reducers: { // state를 변경하는 함수가 들어감
        login:(state) =>{
            localStorage.setItem('isLoggedIn', 'yes'); // 로컬스토리지에 로그인 되었다고 저장
            state.isLoggedIn = true;
        },
        logout:(state)=>{
            localStorage.removeItem('isLoggedIn'); // 로컬스토리지 로그인 되었다고 저장된거 삭제
            state.isLoggedIn = false;
        }
    }
})

export const {login, logout } = authSlice.actions;

export default authSlice.reducer;