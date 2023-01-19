import { Input } from '@mantine/core';
import { HiOutlineSearch } from 'react-icons/hi';

export const SearchInput = () => (
  <Input
    icon={<HiOutlineSearch size={22} />}
    placeholder="Search"
    radius="xl"
    size="lg"
    w="100%"
    variant="filled"
  />
);
