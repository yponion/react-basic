import propTypes from "prop-types";

const Toast = ({toasts, deleteToast}) => {
    return (
        <div className="position-fixed bottom-0 end-0 p-2">
            {toasts.map(toast => {
                return (
                    <div
                        key={toast.id}
                        // onClick엔 함수가 들어가야함. deleteToast가 함수니까 이렇게 넣으면 되는데 deleteToast()이건 함수를 실행시키는 거기때문에 ()=> 사용
                        onClick={() => {
                            deleteToast(toast.id)
                        }}
                        className={`cursor-pointer alert alert-${toast.type || 'success'} m-0 py-2 mt-2`}
                    >
                        {toast.text}
                    </div>
                );
            })}
        </div>
    )
}

Toast.propType = {
    // toasts라는 array를 받을 건데 array안에 object가 들어감 각각의 object안에 text가 들어감 //[{text:'text'}, {}, ]
    toasts: propTypes.arrayOf(propTypes.shape({
        text: propTypes.string,
        type: propTypes.string
    })).isRequired, // 필수
    deleteToast: propTypes.func.isRequired,
}
Toast.defaultProps = {
    toasts: [] // 아무것도 안보냈을 때 기본값 빈배열
}

export default Toast;