import { v4 as uuidv4 } from "uuid";

export const initialState = (roomId, room, username, baseURL, subdirectory) => {
  const commonProperties = {
    id: roomId,
    name: room,
    createdBy: username + "*",
    attendees: [],
    URL: `${baseURL}/${subdirectory}/${roomId}`,
  };

  const storyPoints = {
    viewPoint: false,
    avgResult: 0.0,
  };

  const defaultRetro = {
    timerStarted: false,
    currentPage: "think",
    retroCategory: [
      {
        id: uuidv4(),
        title: "Category-1",
        description: "This is caregory one description",
        attendeeInput: [], // id, content, vote
        inputGroups: [], // id, groupTitle, groupedInputIds: []
        orderId: 1,
      },
      {
        id: uuidv4(),
        title: "Category-2",
        description: "This is caregory two description",
        attendeeInput: [],
        inputGroups: [],
        orderId: 2,
      },
      {
        id: uuidv4(),
        title: "Category-3",
        description: "This is caregory three description",
        attendeeInput: [],
        inputGroups: [],
        orderId: 3,
      },
    ],
  };

  switch (subdirectory) {
    case "storypoint":
      return { ...commonProperties, ...storyPoints };
    case "retro":
      return { ...commonProperties, ...defaultRetro };
  }
};
