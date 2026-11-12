import type {Meta, StoryObj} from '@storybook/react-vite';
import {LoadingMessage} from '../../atoms/LoadingMessage';
import {ErrorMessage} from '../../atoms/ErrorMessage';

const meta = {
  title: 'Atoms/Feedback',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;





// export from src/storybook/components
type HasChildren={
    children?:React.ReactNode
}


const StoryComponents={
    Container:({children,className}:HasChildren&{className?:string})=>{
      return  <div className={`flex h-48 w-full items-stretch border border-zinc-200 ${className??''}`}>
          {children}
        </div>

    }

    // rest util components
}

const {Container}=StoryComponents

export const Loading: Story = {
  render: () => (
    <Container >
      <LoadingMessage msg="Loading events…" />
    </Container>
  ),
};

export const ErrorWithMessage: Story = {
  name: 'Error (msg)',
  render: () => (
    <Container >
      <ErrorMessage msg="Failed to load events." />
    </Container>
  ),
};

export const ErrorWithCode: Story = {
  name: 'Error (code + msg)',
  render: () => (
    <Container >
      <ErrorMessage code={404} msg="Event not found." />
    </Container>
  ),
};

export const LoadingInline: Story = {
  name: 'Loading (inline)',
  render: () => (
    <Container>
      <div className="w-full">
        <LoadingMessage variant="inline" label="Loading transactions…" />
      </div>
    </Container>
  ),
};

export const ErrorWithRetry: Story = {
  name: 'Error (card + detail + retry)',
  render: () => (
    <Container>
      <ErrorMessage code={503} title="Failed to load events" error="The upstream service is unavailable." onRetry={() => {}} />
    </Container>
  ),
};

export const ErrorInline: Story = {
  name: 'Error (inline + retry)',
  render: () => (
    <div className="max-w-md">
      <ErrorMessage variant="inline" title="Failed to load" error="Network request timed out." onRetry={() => {}} />
    </div>
  ),
};
