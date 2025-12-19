'use client';

import React, { useState } from 'react';
import {
  Button,
  Slider,
  Dropdown,
  ColorPicker,
  Input,
  Tooltip,
  Modal,
  ModalFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  IconButton,
  ProgressBar,
  CircularProgress
} from './index';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Settings,
  Download,
  Trash2,
  Search
} from 'lucide-react';

export default function ComponentsDemo() {
  const [volume, setVolume] = useState(50);
  const [opacity, setOpacity] = useState(100);
  const [resolution, setResolution] = useState('1080p');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#ffffff');
  const [videoTitle, setVideoTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exportProgress, setExportProgress] = useState(65);

  const resolutionOptions = [
    { value: '480p', label: '480p SD' },
    { value: '720p', label: '720p HD' },
    { value: '1080p', label: '1080p Full HD' },
    { value: '1440p', label: '1440p 2K' },
    { value: '4k', label: '4K Ultra HD' }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Video Editor UI Components</h1>
          <p className="text-zinc-400">A comprehensive showcase of all available components</p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Icon Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Icon Buttons</h2>
          <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
            <div className="flex gap-3 flex-wrap items-center">
              <Tooltip content="Play video" position="top">
                <IconButton
                  icon={<Play />}
                  variant="primary"
                  onClick={() => setIsPlaying(!isPlaying)}
                  active={isPlaying}
                />
              </Tooltip>
              <Tooltip content="Pause video" position="top">
                <IconButton icon={<Pause />} variant="default" />
              </Tooltip>
              <Tooltip content="Skip backward" position="top">
                <IconButton icon={<SkipBack />} size="sm" />
              </Tooltip>
              <Tooltip content="Skip forward" position="top">
                <IconButton icon={<SkipForward />} size="sm" />
              </Tooltip>
              <Tooltip content="Delete" position="top">
                <IconButton icon={<Trash2 />} variant="danger" />
              </Tooltip>
              <Tooltip content="Settings" position="top">
                <IconButton icon={<Settings />} variant="ghost" />
              </Tooltip>
            </div>
          </div>
        </section>

        {/* Sliders Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Sliders</h2>
          <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 space-y-6">
            <Slider
              value={volume}
              onChange={setVolume}
              min={0}
              max={100}
              label="Volume"
              showValue
            />
            <Slider
              value={opacity}
              onChange={setOpacity}
              min={0}
              max={100}
              label="Opacity"
              showValue
            />
          </div>
        </section>

        {/* Dropdowns & Color Pickers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Dropdowns & Color Pickers</h2>
          <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Dropdown
                options={resolutionOptions}
                value={resolution}
                onChange={setResolution}
                label="Export Quality"
              />
              <ColorPicker
                value={backgroundColor}
                onChange={setBackgroundColor}
                label="Background Color"
              />
              <ColorPicker
                value={textColor}
                onChange={setTextColor}
                label="Text Color"
              />
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Inputs</h2>
          <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 space-y-4">
            <Input
              label="Video Title"
              placeholder="Enter video title..."
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              fullWidth
            />
            <Input
              label="Search"
              placeholder="Search assets..."
              leftIcon={<Search className="w-4 h-4" />}
              fullWidth
            />
            <Input
              label="Volume Control"
              type="number"
              rightIcon={<Volume2 className="w-4 h-4" />}
              helperText="Set volume level (0-100)"
              fullWidth
            />
            <Input
              label="Required Field"
              placeholder="This field is required"
              required
              error="This field cannot be empty"
              fullWidth
            />
          </div>
        </section>

        {/* Tabs Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tabs</h2>
          <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
            <Tabs defaultValue="video">
              <TabsList>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="video">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Video Settings</h3>
                  <p className="text-zinc-400">
                    Configure video properties like resolution, frame rate, and codec.
                  </p>
                  <Dropdown
                    options={resolutionOptions}
                    value={resolution}
                    onChange={setResolution}
                    label="Resolution"
                  />
                </div>
              </TabsContent>

              <TabsContent value="audio">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Audio Settings</h3>
                  <p className="text-zinc-400">
                    Adjust audio levels, add music, and configure sound effects.
                  </p>
                  <Slider
                    value={volume}
                    onChange={setVolume}
                    label="Master Volume"
                    showValue
                  />
                </div>
              </TabsContent>

              <TabsContent value="effects">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Effects & Filters</h3>
                  <p className="text-zinc-400">
                    Apply visual effects, transitions, and filters to your video.
                  </p>
                  <Slider
                    value={opacity}
                    onChange={setOpacity}
                    label="Effect Opacity"
                    showValue
                  />
                </div>
              </TabsContent>

              <TabsContent value="export">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Export Settings</h3>
                  <p className="text-zinc-400">
                    Choose export format, quality, and destination.
                  </p>
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Open Export Modal
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Progress Bars Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Progress Indicators</h2>
          <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 space-y-6">
            <ProgressBar
              value={exportProgress}
              label="Exporting Video"
              showLabel
              variant="default"
            />
            <ProgressBar
              value={85}
              label="Rendering"
              showLabel
              variant="success"
            />
            <ProgressBar
              value={45}
              label="Processing"
              showLabel
              variant="warning"
              animated
            />
            <div className="flex gap-6 items-center">
              <CircularProgress value={65} />
              <CircularProgress value={85} variant="success" />
              <CircularProgress value={45} variant="warning" size={80} />
            </div>
          </div>
        </section>

        {/* Modal Demo */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Export Video"
          size="lg"
        >
          <div className="space-y-6">
            <Input
              label="File Name"
              placeholder="my-video.mp4"
              fullWidth
            />
            <Dropdown
              options={resolutionOptions}
              value={resolution}
              onChange={setResolution}
              label="Quality"
            />
            <ProgressBar
              value={exportProgress}
              label="Export Progress"
              showLabel
            />
            <p className="text-sm text-zinc-400">
              Your video is being exported. This may take a few minutes depending on the length and quality settings.
            </p>
          </div>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
