import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, FocusEvent } from 'react';
import { useStore } from '../store/user-context';
import { signinRequest, signupRequest } from '../api/requests';
import Input from './inputForm';

const SignUp = ({ close }: { close: () => void }) => {
  console.log('log in triggered');
  const [mounted, setMounted] = useState(false);
  const [el, setEl] = useState(document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(el);
    setMounted(true);
  }, []);

  return mounted
    ? createPortal(
        <PopUp
          toggle={() => {
            close();
            document.body.removeChild(el);
          }}
        />,
        el
      )
    : null;
};

const PopUp = ({ toggle }: { toggle: () => void }) => {
  const [logPref, setPref] = useState(true);

  return (
    <div className="absolute top-0 left-0">
      <div className="fixed z-50 h-1/2 w-1/3 p-3 bg-white rounded-lg border-2 transform translate-x-full translate-y-1/2">
        <div className=" border-b-2">
          <button className="absolute flex " onClick={() => toggle()}>
            <span className="material-icons">close</span>
          </button>

          <div className="flex justify-center">
            <div className="flex mx-16 space-x-4">
              <div
                className="flex-col space-y-1 "
                onClick={() => setPref(true)}
              >
                <button className="rounded-lg p-2 font-medium hover:bg-gray-200">
                  LOG IN
                </button>

                <div className="flex justify-center w-full">
                  {logPref && <Underline />}
                </div>
              </div>
              <div
                className="flex-col space-y-1 "
                onClick={() => setPref(false)}
              >
                <button className="rounded-lg p-2 font-medium hover:bg-gray-200">
                  SIGN UP
                </button>
                <div className="flex justify-center w-full">
                  {!logPref && <Underline />}
                </div>
              </div>
            </div>
          </div>
        </div>
        {logPref ? <SignInForm /> : <SignUpForm />}
      </div>
      <style jsx>
        {`
          :global(body) {
            overflow: hidden;
          }
        `}
      </style>
      <div
        onClick={() => toggle()}
        className="fixed z-30 bg-black h-screen opacity-50 w-screen"
      ></div>
    </div>
  );
};

const SignInForm = () => {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const signIn = async (e) => {
    e.preventDefault();
    const res = await signinRequest({ username, password });

    if ('error' in res) {
      setError(res.error);
    } else {
      console.log('res', res);
    }
  };

  return (
    <div className="relative">
      <div>
        <form className="flex flex-col space-y-4 p-4" onSubmit={signIn}>
          <input
            value={username}
            onChange={(e) => {
              if (e.currentTarget.value.length < 12) {
                setUsername(e.currentTarget.value);
              }
            }}
            className="w-full border-2 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
            placeholder="Username"
          ></input>
          <input
            value={password}
            onChange={(e) => {
              if (e.currentTarget.value.length < 20) {
                setPassword(e.currentTarget.value);
              }
            }}
            className="w-full border-2 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
            placeholder="Password"
            type="password"
          ></input>
          <input
            type="submit"
            className="bottom-2 bg-blue-500 rounded text-white font-medium p-2 px-4"
            value="Log in"
          />
        </form>
        <div className="absolute flex justify-center text-sm text-red-500 w-full">
          {error}
        </div>
      </div>
    </div>
  );
};

const SignUpForm = () => {
  const [cont, setCont] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const signUp = async (e) => {
    e.preventDefault();

    if (rePassword !== password) {
      setError('Password does not match');
      return;
    }

    const res = await signupRequest({
      email,
      username,
      password,
    });

    if ('error' in res) {
      setError(res.error);
      console.log(res.error);
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <form onSubmit={signUp}>
        {cont ? (
          <div className="flex place-content-center p-4">
            <div className="flex flex-col space-y-4">
              <Input
                placeholder="testing123"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              {/* <input
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
                className="w-full border-2 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                placeholder="Email"
                type="email"
              ></input> */}

              <button
                className="bg-blue-500 rounded text-white font-medium p-2"
                onClick={() => setCont(false)}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="flex place-content-center p-4">
            <div className="flex flex-col space-y-4">
              <input
                value={username}
                onChange={(e) => {
                  if (e.currentTarget.value.length < 9) {
                    setUsername(e.currentTarget.value);
                  }
                }}
                className="w-full border-2 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                placeholder="Username"
              ></input>
              <input
                value={password}
                onChange={(e) => {
                  if (e.currentTarget.value.length < 20) {
                    setPassword(e.currentTarget.value);
                  }
                }}
                className="w-full border-2 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                type="password"
              ></input>
              <input
                value={rePassword}
                onChange={(e) => {
                  if (e.currentTarget.value.length < 20) {
                    setRePassword(e.currentTarget.value);
                  }
                }}
                className="w-full border-2 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                placeholder="Re-Enter Password"
                type="password"
              ></input>
              <div className="flex justify-between space-x-2">
                <button
                  className="bg-blue-500 rounded text-white font-medium p-2 px-4"
                  onClick={() => setCont(true)}
                >
                  Back
                </button>
                <input
                  type="submit"
                  className="bg-blue-500 rounded text-white font-medium p-2 px-4 cursor-pointer"
                  value="sign up"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

const Underline = () => {
  return (
    <>
      <svg height="3" width="40">
        <line
          x1="5"
          x2="35"
          style={{ stroke: 'rgb(255,0,0)', strokeWidth: '5' }}
        >
          <animate attributeName="x2" from="20" to="35" dur="0.25" />
          <animate attributeName="x1" from="20" to="5" dur="0.25" />
        </line>
      </svg>
    </>
  );
};

export default SignUp;
