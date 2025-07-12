import { API } from './index.ts';

export interface Scene {
  _id: string;
  userId: string;
  youtubeLink: string;
  startTimecode: number;
  endTimecode: number;
  transcript: string;
  isPublic: boolean;
  audioData?: {
    type: string; // обычно "Buffer"
    data: number[]; // массив чисел — содержимое буфера
  };
  audioMimeType?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateScenePayload {
  youtubeLink: string;
  startTimecode?: number;
  endTimecode?: number;
  transcript?: string;
  audioFile?: File | null;
}

export interface UpdateScenePayload {
  youtubeLink?: string;
  startTimecode?: number;
  endTimecode?: number;
  transcript?: string;
  isPublic?: boolean;
  audioFile?: File | null;
  clearAudio?: boolean;
}



export const createScene = async (data: CreateScenePayload) => {
  const formData = new FormData();

  formData.append('youtubeLink', data.youtubeLink);
  if (data.startTimecode !== undefined) formData.append('startTimecode', data.startTimecode.toString());
  if (data.endTimecode !== undefined) formData.append('endTimecode', data.endTimecode.toString());
  if (data.transcript) formData.append('transcript', data.transcript);
  if (data.audioFile) formData.append('audioFile', data.audioFile);

  const response = await API.post('/scenes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data as { message: "Scene created successfully", sceneId: string};
};


export const getSceneById = async (id: string) => {
  const response = await API.get(`/scenes/${id}`);
  return response.data as Scene;
};

export const updateScene = async (id: string, data: UpdateScenePayload) => {
  const formData = new FormData();

  if (data.youtubeLink !== undefined) formData.append('youtubeLink', data.youtubeLink);
  if (data.startTimecode !== undefined) formData.append('startTimecode', data.startTimecode.toString());
  if (data.endTimecode !== undefined) formData.append('endTimecode', data.endTimecode.toString());
  if (data.transcript !== undefined) formData.append('transcript', data.transcript);
  if (data.isPublic !== undefined) formData.append('isPublic', data.isPublic.toString());
  if (data.clearAudio) formData.append('clearAudio', 'true');
  if (data.audioFile) formData.append('audioFile', data.audioFile);

  const response = await API.put(`/scenes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getScenes = async () => {
  const response = await API.get<Scene[]>('/scenes');
  return response.data;
}
export const deleteScene = async (id: string) => {
  const response = await API.delete(`/scenes/${id}`);
  return response.data;
}