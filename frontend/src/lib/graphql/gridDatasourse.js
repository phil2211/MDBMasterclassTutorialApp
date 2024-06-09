export const createServerSideDatasource = ({ client, searchText, currentUser }) => {
    return {
      getRows: async ({ request, successCallback, failCallback }) => {
        //console.log(await currentUser.functions.getGridDataFastCount({...request, searchText}));
        currentUser.functions.getGridDataFastCount({...request, searchText})
        .then((res) => {
          successCallback(res.rows, res.lastRow?res.lastRow:0)
        })
        .catch(err => {
            console.error(err);
            failCallback();
        })
      }
    }
}