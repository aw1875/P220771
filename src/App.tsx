import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
const socket = io();

interface AppProps { }

type Data = {
  hipData: HipInput;
  shoulderData: ShoulderInput;
}

interface HipInput {
  hipRotation: Number;
  hipVelocity: Number;
}

interface ShoulderInput {
  shoulderRotation: Number;
  shoulderVelocity: Number;
}

export default function App({ }: AppProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [hipMetric, setHipMetric] = useState<HipInput>();
  const [shoulderMetric, setShoulderMetric] = useState<ShoulderInput>();

  useEffect(() => {
    socket.on('connect', () => console.log('Connected'));
    socket.on('disconnect', () => console.log('Diconnected'));

    // Metrics Event Listener
    socket.on('metrics', ({ hipData, shoulderData }: Data) => {
      setTimeout(() => {
        setHipMetric(hipData);
        setShoulderMetric(shoulderData);

        setIsLoading(false);
      }, 2000);
    })

    return () => {
      socket.off('connect');
      socket.off('metrics');
      socket.off('disconnect');
    }
  }, []);

  const startMetrics = () => {
    setLoadingMessage("Getting data...");
    setIsLoading(true);
    socket.emit('start');
  }


  const Metric = ({ type, input }: { type: string, input: Number }) => {
    if (input === 0) {
      return (
        <div className="p-10 rounded bg-gray-700 flex flex-col justify-center items-center">
          <p className="text-white">{type} <span className="font-bold">No Data</span></p>
        </div>
      )
    } else if (input >= 1 && input <= 3) {
      return (
        <div className="p-10 rounded bg-red-500 flex flex-col justify-center items-center">
          <p className="text-white">{type} <span className="font-bold">{input}</span></p>
        </div>
      )
    } else if (input >= 4 && input <= 6) {
      return (
        <div className="p-10 rounded bg-yellow-500 flex flex-col justify-center items-center">
          <p className="text-white">{type} <span className="font-bold">{input}</span></p>
        </div>
      )
    } else {
      return (
        <div className="p-10 rounded bg-green-500 flex flex-col justify-center items-center">
          <p className="text-white">{type} <span className="font-bold">{input}</span></p>
        </div>
      )
    }

  }

  return (
    <div className="w-full h-screen bg-white flex flex-col justify-center items-center">
      {isLoading &&
        (
          <div className="w-full h-screen bg-gray-700/75 absolute flex flex-col gap-2 justify-center items-center">
            <h1 className="text-2xl text-white">{loadingMessage}</h1>
            <div role="status">
              <svg aria-hidden="true" className="mr-2 w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
              </svg>
            </div>
          </div>
        )
      }
      <div className="w-full flex flex-col justify-center items-center gap-y-4">
        <div className="w-full text-center">
          <h1 className="text-3xl">GROUP P22071 HITTING ANALYSIS</h1>
        </div>

        <div className="w-full flex gap-4">
          <div className="w-full bg-orange-500 text-white font-bold flex justify-center items-center py-2 cursor-pointer hover:bg-gray-700" onClick={startMetrics}>Start</div>
        </div>

        <h1 className="text-xl">Metrics</h1>

        <div className="w-full grid grid-cols-4 gap-4">
          <Metric type={"Hip Rotation"} input={hipMetric?.hipRotation ?? 0} />
          <Metric type={"Hip Velocity"} input={hipMetric?.hipVelocity ?? 0} />
          <Metric type={"Shoulder Rotation"} input={shoulderMetric?.shoulderRotation ?? 0} />
          <Metric type={"Shoulder Velocity"} input={shoulderMetric?.shoulderVelocity ?? 0} />
        </div>

        <div className="w-full bg-orange-500 text-white font-bold flex justify-center items-center py-2 cursor-pointer hover:bg-gray-700" onClick={() => alert('Redirect to metrics explained')}>Metrics Explained</div>
      </div>
    </div >
  );
}
