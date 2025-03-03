// Import toàn bộ các thành phần từ thư viện `@radix-ui/react-dropdown-menu` với tên `DropdownMenuPrimitive`
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

// Import các icon từ thư viện `lucide-react`
import { Check, ChevronRight, Circle } from 'lucide-react';

// Import React để sử dụng các tính năng như `forwardRef`
import * as React from 'react';

// Import hàm `cn` từ thư mục `utils`, có thể là hàm giúp xử lý className
import { cn } from '@/utils/utils';

// Định nghĩa `DropdownMenu` là gốc của menu dropdown từ thư viện `@radix-ui/react-dropdown-menu`
const DropdownMenu = DropdownMenuPrimitive.Root;

// Định nghĩa `DropdownMenuTrigger`, phần tử kích hoạt menu
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// Định nghĩa `DropdownMenuGroup`, giúp nhóm các mục trong menu
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// Định nghĩa `DropdownMenuPortal`, giúp hiển thị menu trong một cổng riêng biệt (portal)
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

// Định nghĩa `DropdownMenuSub`, đại diện cho một menu con bên trong menu chính
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// Định nghĩa `DropdownMenuRadioGroup`, giúp tạo nhóm các mục kiểu radio trong menu
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Định nghĩa `DropdownMenuSubTrigger`, là phần tử kích hoạt cho menu con
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...properties }, reference) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={reference}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-zinc-100 data-[state=open]:bg-zinc-100 dark:focus:bg-zinc-800 dark:data-[state=open]:bg-zinc-800',
      inset && 'pl-8', // Nếu `inset` = true thì thêm padding-left 8px
      className,
    )}
    {...properties}
  >
    {children}
    <ChevronRight className="ml-auto size-4" /> {/* Hiển thị icon mũi tên bên phải */}
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

// Định nghĩa `DropdownMenuSubContent`, là nội dung của menu con
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...properties }, reference) => (
  <DropdownMenuPrimitive.SubContent
    ref={reference}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-950 shadow-lg',
      className,
    )}
    {...properties}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

// Định nghĩa `DropdownMenuContent`, là nội dung chính của dropdown menu
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...properties }, reference) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={reference}
      sideOffset={sideOffset} // Định nghĩa khoảng cách giữa trigger và menu
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-950 shadow-md',
        className,
      )}
      {...properties}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// Định nghĩa `DropdownMenuItem`, là các mục trong menu
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...properties }, reference) => (
  <DropdownMenuPrimitive.Item
    ref={reference}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      inset && 'pl-8', // Nếu `inset` = true thì thêm padding-left 8px
      className,
    )}
    {...properties}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// Định nghĩa `DropdownMenuCheckboxItem`, là mục dạng checkbox trong menu
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...properties }, reference) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={reference}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
      className,
    )}
    checked={checked}
    {...properties}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" /> {/* Hiển thị icon dấu check nếu mục được chọn */}
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

// Định nghĩa `DropdownMenuRadioItem`, là mục dạng radio trong menu
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...properties }, reference) => (
  <DropdownMenuPrimitive.RadioItem
    ref={reference}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
      className,
    )}
    {...properties}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current" /> {/* Hiển thị icon vòng tròn nếu mục được chọn */}
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// Định nghĩa `DropdownMenuLabel`, là tiêu đề hoặc nhãn trong menu
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...properties }, reference) => (
  <DropdownMenuPrimitive.Label
    ref={reference}
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...properties}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// Định nghĩa `DropdownMenuSeparator`, là đường kẻ phân cách trong menu
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...properties }, reference) => (
  <DropdownMenuPrimitive.Separator
    ref={reference}
    className={cn('-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800', className)}
    {...properties}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// Định nghĩa `DropdownMenuShortcut`, giúp hiển thị phím tắt trong menu
const DropdownMenuShortcut = ({ className, ...properties }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...properties} />;
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
