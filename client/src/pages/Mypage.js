import styled from "styled-components";
/* eslint-disable */
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getProfile, patchProfile } from "../api";
import { useNavigate } from "react-router";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  margin: auto;
  padding: 10px;
`;
const Form = styled.form`
  width: 100%;
  text-align: center;
  max-width: 360px;
`;
const FormColumn = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  all: unset;
  width: 100%;
  border-bottom: 1px solid ${(props) => (props.error ? "red" : "#aaa2a2")};
  &::placeholder {
    font-size: 13px;
  }
`;
const Label = styled.label`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  color: black;
  font-weight: bold;
`;
const Button = styled.button`
  all: unset;
  padding: 15px 25px;
  background-color: #fbf0d2;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: gray;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  &:hover {
    background-color: ${(props) => (props.disabled ? "" : "#ffdc77")};
  }
  transition: 0.4s;
`;

const Span = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #f45555;
  margin: 10px 0;
`;
const Email = styled.h1``;

const Mypage = () => {
  const { register, handleSubmit, errors, getValues, formState, setValue } = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [check, setCheck] = useState(false);
  const onSubmitValid = async () => {
    const { nickname, password } = getValues();

    await patchProfile({ nickname, password });
    navigate("/drink");
  };

  const getData = async () => {
    const user = await getProfile();
    setValue("nickname", user.nickname);
    setValue("email", user.email);
    setUser({ email: user.email, nickname: user.nickname });
    setCheck(localStorage.getItem("socialType"));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmitValid);
          //첫번째 인자는 모든 유효성검사를 통과했을때 실행하는 함수
          //두번째 인자는 유효성 검사를 하나라도 통과를 못했을때 실행하는 함수
        }}>
        <FormColumn>
          <Email>{user.email}</Email>
        </FormColumn>
        <FormColumn>
          <Label>닉네임</Label>
          <Input
            ref={register({
              required: "닉네임을 꼭 입력해주세요.",
              validate: {
                check: (value) => {
                  const regex = new RegExp(/[^A-Za-z0-9가-힣]/);
                  const isValid = regex.test(value);

                  if (isValid) {
                    return "숫자, 영어, 한글만 입력해주세요";
                  }
                },
              },
              minLength: { value: 2, message: "최소 2자 이상 입력해주세요" },
              maxLength: { value: 8, message: "최대 8자 이하로 입력해주세요" },
            })}
            name='nickname'
            placeholder='2~8글자'
            error={errors.nickname?.message}
          />
          <Span>{errors.nickname?.message}</Span>
        </FormColumn>
        {check ? null : (
          <>
            <FormColumn>
              <Label>비밀번호</Label>
              <Input
                ref={register({
                  required: "비밀번호를 꼭 입력해주세요.",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message: "8자이상 / 영문 / 숫자 / 특수문자를 조합해주세요",
                  },
                })}
                name='password'
                type='password'
                placeholder='8자이상 / 영문 / 숫자 / 특수문자를 조합해주세요'
                error={errors.password?.message}
              />
              <Span>{errors.password?.message}</Span>
            </FormColumn>
            <FormColumn>
              <Label>비밀번호 확인</Label>
              <Input
                ref={register({
                  required: "비밀번호를 꼭 입력해주세요",
                  validate: {
                    matchPassword: (value) => {
                      const { password } = getValues();
                      return password === value || "비밀번호가 일치하지 않습니다.";
                    },
                  },
                })}
                name='password2'
                type='password'
                placeholder='비밀번호를 한번 더 입력해 주세요'
                error={errors.password2?.message}
              />
              <Span>{errors.password2?.message}</Span>
            </FormColumn>
          </>
        )}
        <Button onClick={onSubmitValid} disabled={!formState.isValid}>
          수정하기
        </Button>
      </Form>
    </Container>
  );
};

export default Mypage;
