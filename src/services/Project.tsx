import Instance from "./Instance";

export const GETAllProjects = async () => {
  try {
    const fetching = await Instance.get(
      `${import.meta.env.VITE_GET_LIST_PROJECT}`
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

export const POSTCreateProject = async ({ name }: { name: string }) => {
  try {
    const fetching = await Instance.post(
      `${import.meta.env.VITE_POST_CREATE_PROJECT}`,
      {
        name,
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
