import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push, update, remove } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBeb4cCoy7368O0zBBIqL37-pwlgWhlUKY",
  authDomain: "worker-counter.firebaseapp.com",
  databaseURL:
    "https://worker-counter-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "worker-counter",
  storageBucket: "worker-counter.appspot.com",
  messagingSenderId: "601143722442",
  appId: "1:601143722442:web:523bd39d37cb61e3840f33",
  measurementId: "G-L8NR24J6S0",
};

const rt_database = () => {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const worker_recordRef = ref(database, "worker_record");
  const worker_timeRef = ref(database, "worker_time_stamp");

  const getcurWorkerbydate = async (value) => {
    try {
      // Fetch worker records
      const workerRecordSnapshot = await get(worker_recordRef);
      const workerRecords = workerRecordSnapshot.exists()
        ? workerRecordSnapshot.val()
        : {};

      // Fetch worker timestamps
      const workerTimeStampSnapshot = await get(worker_timeRef);
      const workerTimeStamps = workerTimeStampSnapshot.exists()
        ? workerTimeStampSnapshot.val()
        : {};

      const workerTimeStampArray = Array.isArray(workerTimeStamps)
        ? workerTimeStamps
        : Object.values(workerTimeStamps);

      const mergedData = Object.entries(workerRecords).map(
        ([workerId, workerData]) => {
          const timestampIndex = workerTimeStampArray.findIndex(
            (item) => item?.worker_id === workerId && item?.date === value
          );

          return {
            id: workerId,
            data: workerData,
            timestamps: workerTimeStampArray[timestampIndex],
          };
        }
      );

      return mergedData;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getWorkerRecOn = async () => {
    let data = [];
    await get(worker_recordRef)
      .then((sn) => {
        if (sn.exists()) {
          const workerArray = Object.entries(sn.val()).map(([id, data]) => ({
            id,
            ...data,
          }));
          data = workerArray.filter((item) => item.status === true);
        } else {
          console.log("no data");
        }
      })
      .catch((er) => {
        console.error("Error fetching data:", er.message);
      });

    return data;
  };

  const getWorkerRec = async () => {
    let data = [];
    await get(worker_recordRef)
      .then((sn) => {
        if (sn.exists()) {
          const workerArray = Object.entries(sn.val()).map(([id, data]) => ({
            id,
            ...data,
          }));
          data = workerArray;
        } else {
          console.log("no data");
        }
      })
      .catch((er) => {
        console.error("Error fetching data:", er.message);
      });

    return data;
  };

  const setWorkerRec = async (newData) => {
    await push(worker_recordRef, newData)
      .then((ref) => {
        console.log("Worker record added with ID:", ref.key);
      })
      .catch((er) => {
        console.error("Error adding record:", er.message);
      });
  };

  const updateWorkerRec = async (id, updatedData) => {
    await update(ref(database, `worker_record/${id}`), updatedData)
      .then(() => {
        console.log("Worker record updated successfully");
      })
      .catch((er) => {
        console.error("Error updating record:", er.message);
      });
  };

  const deleteWorkerRec = async (id) => {
    await remove(ref(database, `worker_record/${id}`))
      .then(() => {
        console.log("Worker record deleted successfully");
      })
      .catch((er) => {
        console.error("Error deleting record:", er.message);
      });
  };

  const setWorkertimeRec = async (newData) => {
    await push(worker_timeRef, newData)
      .then((ref) => {
        console.log("Worker record added with ID:", ref.key);
      })
      .catch((er) => {
        console.error("Error adding record:", er.message);
      });
  };

  const updateWorkertimeRec = async (id, updatedData) => {
    await update(ref(database, `worker_time_stamp/${id}`), updatedData)
      .then(() => {
        console.log("Worker record updated successfully");
      })
      .catch((er) => {
        console.error("Error updating record:", er.message);
      });
  };

  const getWorkertimebyidRec = async (value) => {
    let data = [];
    await get(worker_timeRef)
      .then((sn) => {
        if (sn.exists()) {
          const workerArray = Object.entries(sn.val()).map(([id, data]) => ({
            id,
            ...data,
          }));
          data = workerArray.filter((item) => item.worker_id === value);
        } else {
          console.log("no data");
        }
      })
      .catch((er) => {
        console.error("Error fetching data:", er.message);
      });

    return data;
  };

  return {
    database,
    getWorkerRec,
    setWorkerRec,
    updateWorkerRec,
    deleteWorkerRec,
    getWorkerRecOn,
    getcurWorkerbydate,
    setWorkertimeRec,
    updateWorkertimeRec,
    getWorkertimebyidRec,
  };
};

export default rt_database;
