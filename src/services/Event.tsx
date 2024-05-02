import Instance from "./Instance";

export const GETAllEvents = async ({ search }: { search?: string }) => {
  try {
    const fetching = await Instance.get(
      `${import.meta.env.VITE_GET_LIST_EVENT}`,
      {
        params: {
          search,
        },
      }
    );

    const result = {
      isSuccess: fetching.data.success,
      isError: !fetching.data.success,
      data: fetching.data,
    };

    return result;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      data: error,
    };
  }
};

export const GETDetailEvent = async ({ uuid }: { uuid: string }) => {
  try {
    const fetching = await Instance.get(
      `${import.meta.env.VITE_GET_DETAIL_EVENT}/${uuid}`
    );

    const result = {
      isSuccess: fetching.data.success,
      isError: !fetching.data.success,
      data: fetching.data,
    };

    return result;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      data: error,
    };
  }
};

export const POSTCreateEvent = async ({
  user_id,
  time,
  eventTitle,
  projectName,
}: {
  user_id: string;
  time: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  };
  eventTitle: string;
  projectName: string;
}) => {
  try {
    const fetching = await Instance.post(
      `${import.meta.env.VITE_POST_CREATE_EVENT}`,
      {
        user_id,
        time,
        eventTitle,
        projectName,
      }
    );

    const result = {
      isSuccess: fetching.data.success,
      isError: !fetching.data.success,
      data: fetching.data,
    };

    return result;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      data: error,
    };
  }
};

export const PATCHEditEvent = async ({
  uuid,
  time,
  eventTitle,
  projectName,
}: {
  uuid: string;
  time: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  };
  eventTitle: string;
  projectName: string;
}) => {
  try {
    const fetching = await Instance.patch(
      `${import.meta.env.VITE_PATCH_EDIT_EVENT}/${uuid}`,
      {
        time,
        eventTitle,
        projectName,
      }
    );

    const result = {
      isSuccess: fetching.data.success,
      isError: !fetching.data.success,
      data: fetching.data,
    };

    return result;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      data: error,
    };
  }
};

export const DELETEEvent = async ({ uuid }: { uuid: string }) => {
  try {
    const fetching = await Instance.delete(
      `${import.meta.env.VITE_DELETE_EVENT}/${uuid}`
    );

    const result = {
      isSuccess: fetching.data.success,
      isError: !fetching.data.success,
      data: fetching.data,
    };

    return result;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      data: error,
    };
  }
};
