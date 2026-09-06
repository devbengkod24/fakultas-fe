/* eslint-disable @typescript-eslint/no-explicit-any */
const SyncLms = ({
    config,
  }: {
    config: () => Headers;
  }) => {
  
    return {
        syncLms: (data: any) => {
          const headers = config();

          headers.set('x-api-key', 'gajahnyaterbanglhoh@@');
  
          const requestConfig = {
              method: "POST",
              body: JSON.stringify(data),
              headers,
          };
          return fetch(`https://api-bengkelkoding.dinus.id/api/v2/sync/bk_sync_data`, requestConfig)
              .then((response) => response.json())
              .catch((error) => {
              throw new Error(`Error syncing LMS data: ${error.message}`);
          });
        }, 
   };
};
  
export default SyncLms;