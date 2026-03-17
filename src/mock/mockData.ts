export const DepartmentList = [
  {
    id: '0',
    title: '학과명0',
    subTitle: '학과 영문명',
    imgSrc: 'https://cdn.pixabay.com/photo/2025/08/09/16/51/wildlife-9764923_1280.jpg',
    href: '#',
  },
  {
    id: '1',
    title: '학과명1',
    subTitle: '학과 영문명',
    imgSrc: 'https://cdn.pixabay.com/photo/2018/10/01/09/21/pets-3715733_1280.jpg',
    href: '#',
  },
  {
    id: '2',
    title: '학과명2',
    subTitle: '학과 영문명',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    href: '#',
  },
  {
    id: '3',
    title: '학과명3',
    subTitle: '학과 영문명',
    imgSrc: 'https://cdn.pixabay.com/photo/2021/12/14/09/37/animal-6870176_1280.jpg',
    href: '#',
  },
  {
    id: '5',
    title: '학과명1',
    subTitle: '학과 영문명',
    imgSrc: 'https://cdn.pixabay.com/photo/2018/10/01/09/21/pets-3715733_1280.jpg',
    href: '#',
  },
  {
    id: '6',
    title: '학과명2',
    subTitle: '학과 영문명',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    href: '#',
  },
  {
    id: '7',
    title: '학과명3',
    subTitle: '학과 영문명',
    imgSrc: 'https://cdn.pixabay.com/photo/2021/12/14/09/37/animal-6870176_1280.jpg',
    href: '#',
  },
];

export const STUDENT_DATA = {
  id: '0',
  name: '김OO',
  en_name: 'KimOO',
  department: '국문학과',
  manager: '다OO',
  email: 'kimEmail@gmail.com',
  phone: '010-1234-5678',
  photo_id: 'https://cdn.pixabay.com/photo/2019/08/01/12/19/raccoon-4377383_1280.jpg',
  photo_graduation: 'https://cdn.pixabay.com/photo/2023/11/05/12/57/squirrel-8367079_1280.jpg',
  created: '2022-01-01',
  updated: '2025-01-01',
};

export type PhotoItem = {
  id: string;
  type: 'photo' | 'video';
  title: string;
  imgSrc: string;
  category: 'all' | 'team' | 'organization' | 'club' | 'event';
  created: string;
  updated: string;
};

export const PHOTO_DATA: PhotoItem[] = [
  {
    id: '1',
    type: 'photo',
    title: '팀플 단체사진',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'team',
    created: '2025-09-01',
    updated: '2025-09-01',
  },
  {
    id: '2',
    type: 'video',
    title: '동아리 공연',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'club',
    created: '2025-09-05',
    updated: '2025-09-06',
  },
  {
    id: '3',
    type: 'photo',
    title: '체육대회',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'event',
    created: '2025-09-10',
    updated: '2025-09-10',
  },
  {
    id: '4',
    type: 'photo',
    title: '체육대회',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'event',
    created: '2025-09-10',
    updated: '2025-09-10',
  },
  {
    id: '5',
    type: 'photo',
    title: '체육대회',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'club',
    created: '2025-09-10',
    updated: '2025-09-10',
  },
  {
    id: '6',
    type: 'video',
    title: '체육대회',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'event',
    created: '2025-09-10',
    updated: '2025-09-10',
  },
  {
    id: '7',
    type: 'video',
    title: '체육대회',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'event',
    created: '2025-09-10',
    updated: '2025-09-10',
  },
  {
    id: '8',
    type: 'photo',
    title: '체육대회',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'event',
    created: '2025-09-10',
    updated: '2025-09-10',
  },
  {
    id: '9',
    type: 'photo',
    title: '체육대회',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'club',
    created: '2025-09-10',
    updated: '2025-09-10',
  },
  {
    id: '10',
    type: 'photo',
    title: '체육대회',
    imgSrc: 'https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg',
    category: 'event',
    created: '2025-09-10',
    updated: '2025-09-10',
  },
];
