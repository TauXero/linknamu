import Image from "next/image";

type Props = {
  name: string;
  bio: string;
  image: string;
};

export default function ProfileHeader({ name, bio, image }: Props) {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-md ring-4 ring-white dark:ring-neutral-800 sm:h-40 sm:w-40">
        <Image src={image} alt={`${name} 프로필 사진`} fill sizes="160px" className="object-cover" priority />
      </div>
      <h1 className="mt-5 text-xl font-bold sm:text-2xl">{name}</h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">{bio}</p>
    </header>
  );
}
